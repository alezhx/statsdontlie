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
// import Search from '../components/Search'
import PlayerSearch from '../components/PlayerSearch';
import axios from 'axios'


class PlayerStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preStats: {},
      postStats: {}
    }
  };

  componentDidMount = () => {
    this.loadAllStats()
    this.getPlayerImage(this.props.playerName)
  }

  loadAllStats = () => {
    this.loadPreBubbleStats(this.props.playerId)
    this.loadBubbleStats(this.props.playerId)
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => { 
    if(prevProps.playerId !== this.props.playerId) {
      this.loadAllStats()
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
    console.log("pre stats", data);
    
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
    console.log("post stats", data);

    this.setState({postStats:this.getStatAverages(data)})
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
  
  getPlayerImage = (playerName) => {
    let param = JSON.stringify({
      PlayerName: playerName
    })

    fetch('/api/images',{
      method: 'POST',
      body: param,
      headers: {"Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(list => console.log('AAAAAAAAIMAGES',list))
  }

  render() {
    return (
      <div key={this.props.playerId}>
        <Container>
          {this.renderSearchBar()}
        </Container>
        <div>
        {JSON.stringify(this.state.preStats)}
        </div>
        <div>
        {JSON.stringify(this.state.postStats)}
        </div>
        <div>
          {/* image */}
        </div>
      </div>
    )
  }
}

export default PlayerStats