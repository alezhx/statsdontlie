import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Table,
  Header,
  Container,
  Icon,
  Grid
} from 'semantic-ui-react'
import PlayerSearch from 'components/PlayerSearch';
import StatsTable from 'components/StatsTable';
import axios from 'axios'
import _ from 'lodash'
import LoadingSpinner from 'components/LoadingSpinner';
import ReactPlayer from 'react-player';
import NoStats from 'components/NoStats';
import UtilTools from 'utils/UtilTools';

class PlayerStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preStats: {},
      postStats: {},
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
      this.setState({isLoading:false})
    })
  }

  renderSearchBar = () => {
    return (
      <Container style={{position:'sticky', paddingTop:15, paddingBottom:15, display:'flex', justifyContent:'center', top:'0px', backgroundColor:'#7285a5', width:'100%', boxShadow: "2px 2px 15px black"}}>
        <a href="" style={{display:'flex', alignItems:'center', paddingRight:10}}>
          <div 
            style={{
              display:'block',
              color:'#fff', 
              fontSize:'2em',
              textShadow: '1px 1px 3px black'
            }}
          >
            stats don't lie <span role="img" aria-label="baskeball">🏀</span>
          </div>
        </a>

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
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:30, marginBottom:60}}>
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
              as='h2'
              content="Player Highlights"
              inverted
              style={{
                fontSize: '2em',
                textShadow: "2px 2px 2px black",
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
      // <div>
      //   <Container style={{ width:'80%',paddingBottom:'1em'}}>
      //     <Header
      //       as='h1'
      //       content={this.props.playerName}
      //       inverted
      //       style={{
      //         fontSize: '3em',
      //         fontWeight: 'bold',
      //         marginTop: '.5em',
      //         borderBottom: '1px solid white',
      //       }}
      //     />
      //   </Container>
      <div style={{minHeight:600}}>
      <Container>
        <div style={{paddingBottom:'1em'}}>
          <Header
            as='h1'
            content={this.props.playerName}
            inverted
            style={{
              fontSize: '3em',
              fontWeight: 'bold',
              marginTop: '.5em',
              borderBottom: '1px solid white',
            }}
          />
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop:20, marginBottom:50}}>
          <div style={{
            width:'30%', 
            backgroundColor:'#02326e', 
          }}>
            <Grid columns={4} centered>
              <Grid.Row style={{fontWeight:'bold', fontSize: '2em', color:'white'}}>
                Pre-bubble '19-20
              </Grid.Row>
              <Grid.Row>
                <Grid.Column/>
                <Grid.Column>
                  PTS
                </Grid.Column>
                <Grid.Column>
                  {preStats.pts}
                </Grid.Column>
                <Grid.Column/>
              </Grid.Row>
            </Grid>
            {/* <div>REB {preStats.reb}</div>
            <div>AST {preStats.ast}</div>
            <div>FG {preStats.fg_pct}%</div>
            <div>TO {preStats.turnover}</div> */}
          </div>
          <div style={{width:'40%', textAlign:'center', height:'70vh', verticalAlign:'top'}}>
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
            display:'flex', justifyContent:'space-around', alignItems:'center', 
            flexDirection:'column',
            color:'white',
            fontSize: '2em'
          }}>        
            <div style={{fontWeight:'bold', fontSize:36}}>Bubble '20</div>
            <div>
              PTS {postStats.pts}
              &nbsp;
              {differences.pts>0 ? <IncreaseIcon/> : <DecreaseIcon/>}
            </div>
            <div>
              REB {postStats.reb}
              &nbsp;
              {differences.reb>0 ? <IncreaseIcon/> : <DecreaseIcon/>}
            </div>
            <div>
              AST {postStats.ast}
              &nbsp;
              {differences.ast>0 ? <IncreaseIcon/> : <DecreaseIcon/>}
            </div>
            <div>
              FG {postStats.fg_pct}%
              &nbsp;
              {differences.fg_pct>0 ? <IncreaseIcon/> : <DecreaseIcon/>}
            </div>
            <div>
              TO {postStats.turnover}
              &nbsp;
              {differences.to>0 ? <IncreaseIcon/> : <DecreaseIcon/>}
            </div>
          </div>
        </div>
        </Container>
        </div>
    )
  }

  renderNoStatsPage = () => {
    return (
      <NoStats playerName = {this.props.playerName}/>
    )
  }   

  render() {
    return (
      <div 
        key={this.props.playerId + this.props.playerName} 
        style={{backgroundColor:'#1b1c1d'}}
      >
        {this.renderSearchBar()}
          <div>
          {/* {_.isEmpty(this.state.postStats) ? 
            <div>
              {this.state.isLoading ? <LoadingSpinner /> :        
                <div>{this.renderNoStatsPage()}</div>}
            </div> 
            : this.renderPlayerStats()} */}
          {this.state.isLoading ? <LoadingSpinner /> :
            <div>
              {_.isEmpty(this.state.postStats) ? this.renderNoStatsPage() : this.renderPlayerStats()}
            </div>
          }
          </div>
      </div>
    )
  }
}

export default PlayerStats