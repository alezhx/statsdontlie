import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'
import PlayerSearch from '../components/PlayerSearch';
import axios from 'axios'
import _ from 'lodash'
import LoadingSpinner from '../components/LoadingSpinner';
import ReactPlayer from 'react-player'

class PlayerStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preStats: {},
      postStats: {},
      playerImageLink: '',
      playerHighlights: '',
      isLoading: true,
      imageLoaded: false,
      image: {
        height: null,
        width: null,
        displayH: '100%',
        displayW: '100%'
      }
    }
  };

  componentDidMount = () => {
    this.loadAllStatActions()
  }

  loadAllStatActions = () => {
    this.setState({isLoading:true, playerImageLink:""})
    this.deloadImage()
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
    
    this.setState({preStats:this.getStatAverages(data)})
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

    this.setState({postStats:this.getStatAverages(data)}, () => {
      if (!(_.isEmpty(this.state.postStats))) {
        this.getPlayerImage(this.props.playerName)
        this.getPlayerHighlights(this.props.playerName)
      }
      this.setState({isLoading:false})
    })
  }

  getStatAverages = (response) => {
      let onlyStats = response.data;
      let compressedStats = {}
    
      for (let i = 0; i < onlyStats.length; i++){
        for (const key in onlyStats[i]) {
          if (key !== 'game' && key !== 'min' && key !== 'player' && key !== 'team' && key !== 'id') {
            compressedStats[key] = compressedStats[key] ? (compressedStats[key] + onlyStats[i][key]) : onlyStats[i][key]
          }
        }
      }
      let totalfgm = compressedStats['fgm'];
      let totalfga = compressedStats['fga'];
      let totalfg3a = compressedStats['fg3a'];
      let totalfg3m = compressedStats['fg3m'];
      let totalfta = compressedStats['fta'];
      let totalftm = compressedStats['ftm'];
      
      for (const key in compressedStats) {
        compressedStats[key] = (compressedStats[key] / onlyStats.length).toFixed(1);
        if (key === 'fg_pct') {
          compressedStats[key] = ((totalfgm / totalfga) * 100).toFixed(1);
        }
        if (key === 'fg3_pct') {
          compressedStats[key] = ((totalfg3m / totalfg3a) * 100).toFixed(1);
        }
        if (key === 'ft_pct') {
          compressedStats[key] = ((totalftm / totalfta) * 100).toFixed(1);
        }
      }
      return compressedStats;
  }

  renderSearchBar = () => {
    return (
      <PlayerSearch addPlayerId={this.props.changePlayerId}/>
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
      console.log('google Image', data)
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
  }

  handleImageLoaded = () => {
    console.log('imageLoaded')
    // this.setState({ imageLoaded: true }, () => console.log('imageLoaded', this.state.imageLoaded));
    if(this.state.image.height > this.state.image.width) {
      this.setState({image:{
        displayH: 'auto',
        displayW: '100%'
      }})
    } else {
      this.setState({image:{
        displayH: '100%',
        displayW: 'auto'
      }})
    }
  }

  deloadImage = () => {
    this.setState({ imageLoaded: false });
  }


  renderPlayerStats = () => {
    return (
      <div >
        <div>
        {JSON.stringify(this.state.preStats)}
        </div>
        <div>
        {JSON.stringify(this.state.postStats)}
        </div>
        {/* <div>
          <img src={this.state.playerImageLink} loading='lazy'/>
        </div> */}
        {this.renderImageQuickStats()}
        <div>
          <h3> Player Highlights </h3>
          { this.state.playerHighlights ? <ReactPlayer url = {this.state.playerHighlights}/> : <div/> }
        </div>
      </div>
    )
  }

  renderImageQuickStats = () => {
    return (
      <Container style={{width:'80%', display:'flex', justifyContent:'center'}}>
        <div style={{width:'30%', backgroundColor:'red'}}>

        </div>
        <div style={{width:'40%', textAlign:'center', height:'70vh', verticalAlign:'top'}}>
          <img 
            onLoad={this.handleImageLoaded}
            src={this.state.playerImageLink} 
            style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 0%'}} 
            // style={{width: this.state.image.displayW, height: this.state.image.displayH, objectFit:'contain'}}
            loading='lazy'
          />
        </div>
        {/* <div
          style={{
            backgroundImage: `url(${this.state.playerImageLink})`,
            width: '40%',
            height: '65vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        > */}

        <div style={{width:'30%', backgroundColor:'red'}}>

        </div>
      </Container>
    )
  }

  renderNoStatsPage = () => 
      <div>
        NO STATS TRY AGAIN
      </div>

  render() {
    return (
      <div 
        key={this.props.playerId + this.props.playerName} 
        style={{backgroundColor:'#1b1c1d'}}
      >
        <Container>
          {this.renderSearchBar()}
        </Container>
        {this.state.isLoading ? <LoadingSpinner /> :        
          <div>
            {_.isEmpty(this.state.postStats) ? this.renderNoStatsPage() : this.renderPlayerStats()}
          </div>
        }
      </div>
    )
  }
}

export default PlayerStats