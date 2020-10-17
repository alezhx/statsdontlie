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
    }
  };



  renderHomePage() {
    return <HomepageLayout addPlayerId = {this.addPlayerId} />
  }

  addPlayerId(playerId) {
    this.setState({playerId})
  }

  removePlayerId() {
    this.setState({playerId : null})
  }

  renderStatsPage() {
    return <PlayerStats removePlayerId = {this.removePlayerId} changePlayerId = {this.addPlayerId} />
  }

  render () {
    return (
    <div>
      {this.state.playerId ?  this.renderStatsPage() : this.renderHomePage()}
    </div>
    )
  }
}

export default App;