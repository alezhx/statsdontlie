import _ from 'lodash'
import faker from 'faker'
import React from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import axios from 'axios'

// const source = _.times(5, () => ({
//   name: faker.company.companyName(),
// }))

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

function SearchExampleStandard() {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state

  const [playerSource, updatePlayerSource] = React.useState({})

  const searchNbaPlayers = (name) => {
    console.log('name', name)
    axios.get('https://www.balldontlie.io/api/v1/players', {
      params: {
        search: name
      }
    })
    .then(function (response) {
      updatePlayerSource(response)
      console.log('search results', response)
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.name)

      dispatch({
        type: 'FINISH_SEARCH',
        // results: _.filter(playerSource, isMatch),
        results: searchNbaPlayers(data.value)
      })
    }, 300)
  }, [])
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Grid>
      <Search
        loading={loading}
        onResultSelect={(e, data) =>
          dispatch({ type: 'UPDATE_SELECTION', selection: data })
        }
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
      />
    </Grid>
  )
}

export default SearchExampleStandard
