import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import HomepageLayout from './views/Homepage'
import PlayerStats from './views/PlayerStats'
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerId : null,
      playerName: '',
    }
  };

  componentDidMount = () => {
    this.googleImages()
  }
  googleImages = async(playerName) => {
    console.log(process.env.REACT_APP_GOOGLE_API_KEY, "environment")
      let images = await axios.get('https://www.googleapis.com/customsearch/v1?', {
        params: {
          key: process.env.REACT_APP_GOOGLE_API_KEY,
          cx: process.env.REACT_APP_GOOGLE_CX,
          imgSize: "XLARGE",
          num: 5,
          q: "Lebron James 2020",
          safe: "active",
          searchType: "image"
        }
      })
      console.log(images);
  }


  renderHomePage = () => {
    return <HomepageLayout addPlayerId = {this.addPlayerId} />
  }

  addPlayerId = (playerId, playerName) => {
    console.log('playerId sent', playerId)
    this.setState({playerId, playerName}, () => console.log('playerId state', this.state))
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
      {this.state.playerId ?  this.renderStatsPage(this.state.playerId, this.state.playerName) : this.renderHomePage()}
    </div>
    
    )
  }
}

export default App;