import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import HomepageLayout from './views/Homepage'
import PlayerStats from './views/PlayerStats'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerId : null,
      playerName: '',
    }
  };

  componentDidMount = () => {
  }

  renderHomePage = () => {
    return <HomepageLayout addPlayerId = {this.addPlayerId} />
  }

  addPlayerId = (playerId, playerName) => {
    this.setState({playerId, playerName})
  }

  removePlayerId = () => {
    this.setState({playerId : null, playerName: ''})
  }

  renderStatsPage = (playerId, playerName) => {
    return <PlayerStats 
            playerId = {playerId} 
            playerName = {playerName}
            removePlayerId = {this.removePlayerId} 
            changePlayerId = {this.addPlayerId} 
          />
  }

  render () {
    return (
    <div>
      {this.state.playerId ? this.renderStatsPage(this.state.playerId, this.state.playerName) : this.renderHomePage()}
    </div>
    )
  }
}

export default App;