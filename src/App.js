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

  componentDidMount = () => {
    // this.googleImagesTest()
    this.expressTest()
    // this.getList()
  }


  getList = () => {
    fetch('/api/getList')
    .then(res => res.json())
    .then(list => console.log('test',list))
  }

  expressTest = () => {
    fetch('/api/images')
    .then(res => res.json())
    .then(list => console.log('TESTIMAGES',list))
  }

  googleImagesTest = () => {
    const GoogleImages = require('google-images');

    const client = new GoogleImages('6d5cc39ca7f4caaae', 'AIzaSyB63_1kCTgX0KcooqT7CTNbEcmjqR1RAIs');

    client.search('Lebron James site:nba.com', {size:'large', })
      .then(images => {
          console.log('images', images)
      });
  }

  renderHomePage = () => {
    return <HomepageLayout addPlayerId = {this.addPlayerId} />
  }

  addPlayerId = (playerId) => {
    console.log('playerId sent', playerId)
    this.setState({playerId}, () => console.log('playerId state', this.state.playerId))
  }

  removePlayerId = () => {
    this.setState({playerId : null})
  }

  renderStatsPage = (playerId) => {
    return <PlayerStats playerId = {playerId} removePlayerId = {this.removePlayerId} changePlayerId = {this.addPlayerId} />
  }

  render () {
    return (
    <div>
      {this.state.playerId ?  this.renderStatsPage(this.state.playerId) : this.renderHomePage()}
    </div>
    )
  }
}

export default App;