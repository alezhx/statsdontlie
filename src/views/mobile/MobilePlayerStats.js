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
      <div style={{
        position:'sticky', 
        paddingTop:15, 
        paddingBottom:15, 
        display:'flex', 
        justifyContent:'center', 
        top:'0px', 
        backgroundColor:'white', 
        width:'100%', 
        boxShadow: "2px 2px 15px black", 
        // borderBottom: '1px solid white',
        padding:8, 
        alignItems:'center'}}>
        <div style={{width:'40%', height:'100%', paddingRight:8}}>
          <a href=""> 
            <img
                style={{
                  objectFit : 'contain',
                  width:'100%',
                  height:'100%'
                }}
                src = {ResultsLogo}
                alt = "sad Jordan"
            />
          </a>
        </div>
        <div style={{width:'60%', display:'inline-block'}}>
          <PlayerSearch search addPlayerId={this.props.changePlayerId}/>
        </div>
      </div>
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
        <div style={{marginTop:30}}>
          <div style={{display:'flex', boxShadow: "1px 1px 1px #000000", position: 'relative', overflow: 'auto',}}>
            <StatsTable mobile statKeys={statCategories} preStats={this.state.preStats} postStats={this.state.postStats}/>
          </div>
          {this.renderVideoHighlights()}
        </div>
      </div>
    )
  }

  renderVideoHighlights = () => {
    if (this.state.playerHighlights) {
      return (
        <Container style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:30, marginBottom:60, width:'100%'}}>
          <div 
            style={{
              padding:12,
              backgroundColor:'#02326e',
              // textAlign:'center',
              color:'white',
              paddingTop:20,
              paddingBottom:30,
              borderRadius:15,
              boxShadow: "5px 5px 5px #000000",
              width:'100%'
            }}
          >
            <Header
              content="PLAYER HIGHLIGHTS"
              inverted
              style={{
                fontSize: '8vw',
                textShadow: "2px 2px 2px black",
                fontFamily: 'ProximaSemiBold',
                margin:0
              }}
            />
            <ReactPlayer url = {this.state.playerHighlights} width={'100%'} height={'30vh'}/> 
          </div>
        </Container>
      )
    } else {
      return (
        <div style={{height:60}}/>
      )
    }
  }

  renderImageQuickStats = () => {

    return (
      <div>
        <div style={{marginLeft:'1em', marginRight:'1em'}}>
          <Header
            content={this.props.playerName}
            inverted
            style={{
              fontSize: '9vw',
              fontWeight: 'bold',
              marginTop: '.5em',
              borderBottom: '1px solid white',
              fontFamily: 'ProximaBold, serif',
            }}
          />
        </div>
        <div style={{width:'100%', textAlign:'center', height:'45vh', marginTop:15}}>
          <img 
            onLoad={() => this.state.playerImageLink && this.setState({isLoading:false})}
            src={this.state.playerImageLink} 
            style={{display:'block', width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 0%'}} 
            loading='lazy'
            alt = "brb using imagination since no pics"
          />
        </div>
        </div>
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
        style={{width:'100vw'}}
        // style={{backgroundColor:'#1b1c1d', width}}
      >
        {this.renderSearchBar()}
          <div>
            <LoadingSpinner active={this.state.isLoading}/>
            {this.renderLogic()}
          </div>
      </div>
    )
  }
}

export default PlayerStats