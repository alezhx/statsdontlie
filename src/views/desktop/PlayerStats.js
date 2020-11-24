import { createMedia } from '@artsy/fresnel';
import React, { Component } from 'react';
import {
  Table,
  Header,
  Container,
  Icon,
  Grid
} from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import ReactPlayer from 'react-player';
import PlayerSearch from 'components/PlayerSearch';
import StatsTable from 'components/StatsTable';
import NoStats from 'components/NoStats';
import LoadingSpinner from 'components/LoadingSpinner';
import UtilTools from 'utils/UtilTools';
import ResultsLogo from 'static/ResultsLogo.png';


class PlayerStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preStats: {},
      postStats: {stats:0},
      playerImageLink: '',
      playerHighlights: '',
      isLoading: true,
    }
  };

  componentDidMount = () => {
    this.loadAllStatActions()
  }

  loadAllStatActions = () => {
    this.setState({isLoading:true, playerImageLink:""})
    this.loadBubbleStats(this.props.playerId)
    this.loadPreBubbleStats(this.props.playerId)
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => { 
    if(prevProps.playerId !== this.props.playerId) {
      this.loadAllStatActions()
    }
  }

  loadPreBubbleStats = async(player_id) => {
    const { data } = await axios.get('https://www.balldontlie.io/api/v1/stats', {
      params: {
        seasons: 2019,
        player_ids: [player_id],
        start_date: "2019-10-22",
        end_date: "2020-03-12",
        per_page: 100
      }
    })

    let cleanStats = {}

    if (!(_.isEmpty(data.data))) {
      cleanStats = UtilTools.getStatAverages(data)
    }

    this.setState({preStats:cleanStats})
  }

  loadBubbleStats = async(player_id) => {
    const { data } = await axios.get('https://www.balldontlie.io/api/v1/stats', {
      params: {
        seasons: 2019,
        player_ids: [player_id],
        start_date: "2020-07-30",
        end_date: "2020-10-12",
        per_page: 100
      }
    })

    let cleanStats = {}

    if (!(_.isEmpty(data.data))) {
      console.log("reaced block")
      cleanStats = UtilTools.getStatAverages(data)
    }

    this.setState({postStats:cleanStats}, () => {
      if (!(_.isEmpty(this.state.postStats))) {
        this.getPlayerImage(this.props.playerName)
        this.getPlayerHighlights(this.props.playerName)
      }
      // this.setState({isLoading:false})
    })
  }

  renderSearchBar = () => {
    return (
      <Container style={{
        position:'sticky',
        padding: 15,
        display:'flex', 
        justifyContent:'center', 
        top:'0px', 
        backgroundColor:'white', 
        width:'100%', 
        boxShadow: "2px 2px 15px black"}}>
        <div style={{width:'20%', height:'100%', paddingRight:8}}>
          <a href="">            
                <img
                  style={{
                    objectFit : 'contain',
                    width:'100%',
                    height:'100%'
                  }}
                  src = {ResultsLogo}
                  alt = "Logo"
              />
          </a>
        </div>
        <div style={{width:'80%', display:'inline-block'}}>
        <PlayerSearch addPlayerId={this.props.changePlayerId}/>
        </div>
      </Container>
    )
  }

  getPlayerImage = async(playerName) => {
    try {
      const {data} = await axios.get('https://www.googleapis.com/customsearch/v1?', {
        params: {
          key: process.env.REACT_APP_GOOGLE_API_KEY,
          cx: process.env.REACT_APP_GOOGLE_CX,
          imgSize: "XLARGE",
          num: 5,
          q: playerName,
          safe: "active",
          searchType: "image",
          dateRestrict: "m[6]"
        }
      }) 
      this.setState({playerImageLink: data.items[0].link,
        image: {
          height: data.items[0].image.height,
          width: data.items[0].image.width
        }
      })
    } catch (error) {
      console.log('Image API error', error)
    }
  }

  getPlayerHighlights = async(playerName) => {
    try {
      const {data} = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.REACT_APP_GOOGLE_API_KEY,
          part: "snippet",
          maxResults: 5,
          q: playerName + " Highlights",
          publishedBefore: "2020-10-26T00:00:00Z",
          publishedAfter: "2020-01-01T00:00:00Z"
        }
      })
      this.setState({playerHighlights: "www.youtube.com/watch?v=" + data.items[0].id.videoId})
    } catch(error) {
      console.log('Video API error', error)
    }
  }

  renderPlayerStats = () => {
    let statCategories = ["fga", "fgm", "fg_pct", "fg3a", "fg3m", "fg3_pct", "fta", "ftm", "ft_pct", "oreb", "DREB" ,"reb", "ast", "blk", "stl", "pf", "turnover", "pts"]

    return (
      <div>
        {this.renderImageQuickStats()}
        <Container>
          <div style={{display:'flex', justifyContent:'center', boxShadow: "3px 3px 3px #000000",}}>
            <StatsTable statKeys={statCategories} preStats={this.state.preStats} postStats={this.state.postStats}/>
          </div>
          {this.renderVideoHighlights()}
        </Container>
      </div>
    )
  }

  renderVideoHighlights = () => {
    if (this.state.playerHighlights) {
      return (
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:60, marginBottom:60}}>
          <div 
            style={{
              padding:36,
              backgroundColor:'#02326e',
              // textAlign:'center',
              color:'white',
              paddingTop:20,
              borderRadius:15,
              boxShadow: "5px 5px 5px #000000"
            }}
          >
            <Header
              content="PLAYER HIGHLIGHTS"
              inverted
              style={{
                fontSize: '3em',
                textShadow: "2px 2px 2px black",
                fontFamily: 'ProximaSemiBold',
                margin:0
              }}
            />
            <ReactPlayer url = {this.state.playerHighlights}/> 
          </div>
        </div>
      )
    } else {
      return (
        <div style={{height:60}}/>
      )
    }
  }

  renderImageQuickStats = () => {
    let {preStats, postStats} = this.state

    let differences = {
      pts: postStats.pts - preStats.pts,
      reb: postStats.reb - preStats.reb,
      ast: postStats.ast - preStats.ast,
      fg_pct: postStats.fg_pct - preStats.fg_pct,
      to: postStats.turnover - preStats.turnover
    }

    const IncreaseIcon = () => <Icon name="caret up" color="green"/>
    const DecreaseIcon = () => <Icon name="caret down" color="red"/>
    return (
      <Container style={{minHeight:500}}>
        <div>
          <Header
            as='h1'
            content={this.props.playerName}
            inverted
            style={{
              fontSize: '3em',
              fontWeight: 'bold',
              marginTop: '.5em',
              borderBottom: '1px solid white',
              fontFamily: 'ProximaBold, serif',
            }}
          />
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop:20, marginBottom:50}}>
          <div style={{
            width:'30%',
            backgroundColor:'#02326e',
            display:'flex', justifyContent:'space-around', alignItems:'center',
            flexDirection:'column',
            color:'white',
            // fontSize: '2em'
          }}>
            <Header
              content="PRE-BUBBLE '19-20"
              inverted
              style={{
                fontSize: '3em',
                textShadow: "2px 2px 2px black",
                fontFamily: 'ProximaSemiBold, serif',
                paddingTop:30,
              }}
            />
            <div
              style={{width:'100%', padding:30, display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'column', fontSize:'2em', fontFamily:'ProximaRegular', height:'100%'}}
            >
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'50%', textAlign:'end', paddingRight:15}}>PTS</div>
                <div style={{width:'50%', fontSize:'1.325em', fontWeight:'bold'}}>{preStats.pts}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'50%', textAlign:'end', paddingRight:15}}>REB</div>
                <div style={{width:'50%', fontSize:'1.325em', fontWeight:'bold'}}>{preStats.reb}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'50%', textAlign:'end', paddingRight:15}}>AST</div>
                <div style={{width:'50%', fontSize:'1.325em', fontWeight:'bold'}}>{preStats.ast}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'50%', textAlign:'end', paddingRight:15}}>FG</div>
                <div style={{width:'50%', fontSize:'1.325em', fontWeight:'bold'}}>{preStats.fg_pct}%</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'50%', textAlign:'end', paddingRight:15}}>TO</div>
                <div style={{width:'50%', fontSize:'1.325em', fontWeight:'bold'}}>{preStats.turnover}</div>
              </div>
            </div>
          </div>
          <div style={{width:'40%', textAlign:'center', height:500,}}>
            <img 
              onLoad={() => this.state.playerImageLink && this.setState({isLoading:false})}
              src={this.state.playerImageLink} 
              style={{display:'block', width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 0%'}} 
              loading='lazy'
              alt = "brb using imagination since no pics"
            />
          </div>
          <div style={{
            width:'30%', 
            backgroundColor:'#02326e', 
            display:'flex', justifyContent:'center', alignItems:'center', 
            flexDirection:'column',
            color:'white',
            // fontSize: '2em'
          }}>        
            <Header
              content="BUBBLE '20"
              inverted
              style={{
                fontSize: '3em',
                textShadow: "2px 2px 2px black",
                fontFamily: 'ProximaSemiBold, serif',
                paddingTop:30
              }}
            />
            <div
              style={{width:'100%', padding:30, display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'column', fontSize:'2em', fontFamily:'ProximaRegular', height:'100%'}}
            >
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'40%', textAlign:'end', paddingRight:15}}>PTS</div>
                <div style={{width:'60%', fontSize:'1.325em', fontWeight:'bold'}}>{postStats.pts}{differences.pts>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'40%', textAlign:'end', paddingRight:15}}>REB</div>
                <div style={{width:'60%', fontSize:'1.325em', fontWeight:'bold'}}>{postStats.reb}{differences.reb>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'40%', textAlign:'end', paddingRight:15}}>AST</div>
                <div style={{width:'60%', fontSize:'1.325em', fontWeight:'bold'}}>{postStats.ast}{differences.ast>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'40%', textAlign:'end', paddingRight:15}}>FG</div>
                <div style={{width:'60%', fontSize:'1.325em', fontWeight:'bold'}}>{postStats.fg_pct}%{differences.fg_pct>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <div style={{width:'40%', textAlign:'end', paddingRight:15}}>TO</div>
                <div style={{width:'60%', fontSize:'1.325em', fontWeight:'bold'}}>{postStats.turnover}{differences.to>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
            </div>
          </div>
        </div>
        </Container>
    )
  }

  onLoadDone = () => {
    this.setState({isLoading:false})
  }

  renderNoStatsPage = () => {
    return (
      <NoStats 
        playerName = {this.props.playerName} 
        onLoadDone = {this.onLoadDone}
      />
    )
  }   

  renderLogic = () => {
    console.log(this.state.postStats, "hello");
    if(_.isEmpty(this.state.postStats)) {
      return this.renderNoStatsPage()
    } else {
      return this.renderPlayerStats()
    }
  }

  render() {
    return (
      <div 
        key={this.props.playerId + this.props.playerName} 
        style={{backgroundColor:'#1b1c1d'}}
      >
        {this.renderSearchBar()}
          <div>
            <LoadingSpinner active={this.state.isLoading}/>
            {this.renderLogic()}
          {/* {_.isEmpty(this.state.postStats) ? 
            <div>
              {this.state.isLoading ? <LoadingSpinner /> :        
                <div>{this.renderNoStatsPage()}</div>}
            </div> 
            : this.renderPlayerStats()} */}
          {/* {this.state.isLoading ? <LoadingSpinner /> :
            <div>
              {_.isEmpty(this.state.postStats) ? this.renderNoStatsPage() : this.renderPlayerStats()}
            </div>
          } */}
          </div>
      </div>
    )
  }
}

export default PlayerStats