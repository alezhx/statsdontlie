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
      //player_id: null,
    }
  };

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    this.showPlayerStatsPage(result.player_id)
  }
  
  showPlayerStatsPage = (player_id) => {
    this.props.addPlayerId(player_id)
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
    console.log("stats", data);
  }
  handleSearchChange = (e, data) => {
    console.log('data1', data.value)
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
    this.setState({ results: data.data }, ()=> console.log('state res', this.state.results))
  }, 350)

  renderResults = (results) => {
     return results.map((item, index) =>
        <Search.Results 
          title={item.first_name + ' ' + item.last_name + '-' + item.team.abbreviation}       
        />
     )
  }

  sanitizeResults = (results) => {
    let sanitizedResults = []
    results.map((item,index) => {
      let player = {
        title: item.first_name + ' ' + item.last_name + ' - ' + item.team.abbreviation,
        player_id: item.id
      }
      sanitizedResults.push(player)
    })
    console.log('sani', sanitizedResults)
    return sanitizedResults
  }

  render () {
    return (
      <Search
        // loading={loading}
        // onResultSelect={(e, data) =>
        //   dispatch({ type: 'UPDATE_SELECTION', selection: data })
        // }
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