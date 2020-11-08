import React, {Component} from 'react';
import axios from 'axios'
import { Search, Grid, Header, } from 'semantic-ui-react'
import { debounce, isEmpty} from 'lodash'

class PlayerSearch extends Component {
  constructor(props) {
     super(props);
    this.state = {
      value: null,
      results: [],
    }
  };

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    this.showPlayerStatsPage(result.player_id, result.player_name)
  }
  
  showPlayerStatsPage = (playerId, playerName) => {
    this.props.addPlayerId(playerId, playerName)
  }

  handleSearchChange = (e, data) => {
    this.setState({value:data.value})
    this.searchPlayers()
  }

  searchPlayers = debounce(async () => {
    const { value } = this.state
    if (isEmpty(value) || value.length < 3) {
      return
    }
    const { data } = await axios.get('https://www.balldontlie.io/api/v1/players', {
      params: {
        search: value
      }
    })
    this.setState({ results: data.data })
  }, 350)

  sanitizeResults = (results) => {
    let sanitizedResults = []
    results.map((item,index) => {
      let player = {
        key: index,
        title: item.first_name + ' ' + item.last_name + ' - ' + item.team.abbreviation,
        player_id: item.id,
        player_name: item.first_name + ' ' + item.last_name
      }
      sanitizedResults.push(player)
    })
    return sanitizedResults
  }

  render () {
    return (
      <Search
        fluid
        input={{ fluid: true, icon: ''}}
        onSearchChange={this.handleSearchChange}
        results={this.sanitizeResults(this.state.results)}
        value={this.state.value || ""}
        onResultSelect={this.handleResultSelect}
      />    
    )
  }
}

export default PlayerSearch;