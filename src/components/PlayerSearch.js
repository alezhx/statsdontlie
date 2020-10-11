import React, {Component} from 'react';
import axios from 'axios'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import { debounce, isEmpty} from 'lodash'

class PlayerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      results: []
    }
  };

  componentDidMount() {
  }

  handleSearchChange = (e, data) => {
    console.log('data', data.value)
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

    console.log('response', data)
    console.log('response', data.data)


    this.setState({ results: data.data }, ()=> console.log('state res', this.state.results))
  }, 350)

  renderResults = (results) => {
    console.log('abc', results)
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
        title: item.first_name + ' ' + item.last_name + ' - ' + item.team.abbreviation
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
        input={{ fluid: true }}
        onSearchChange={this.handleSearchChange}
        // results={this.state.results}
        results={this.sanitizeResults(this.state.results)}
        value={this.state.value}
      />    
    )
  }
}

export default PlayerSearch;