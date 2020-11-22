import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import HomepageLayout from 'views/desktop/Homepage';
import PlayerStats from 'views/desktop/PlayerStats';
import { createMedia } from "@artsy/fresnel";
import MobileHomepage from 'views/mobile/MobileHomepage'
import MobilePlayerStats from 'views/mobile/MobilePlayerStats'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
  },
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerId : null,
      playerName: '',
    }
  };

  renderHomePage = () => {
    return <HomepageLayout addPlayerId = {this.addPlayerId}/>
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

  renderDesktopApp = () =>
  <div>
    {this.state.playerId ? this.renderStatsPage(this.state.playerId, this.state.playerName) : this.renderHomePage()}
  </div>

  renderMobileApp = () => 
  <div>
    {this.state.playerId ? this.renderMobileStatsPage(this.state.playerId, this.state.playerName) : this.renderMobileHomePage()}
  </div>

  renderMobileStatsPage = (playerId, playerName) => {
    return <MobilePlayerStats 
            playerId = {playerId} 
            playerName = {playerName}
            removePlayerId = {this.removePlayerId} 
            changePlayerId = {this.addPlayerId}
          />
  }

  renderMobileHomePage = () => {
    return <MobileHomepage addPlayerId = {this.addPlayerId}/>
  }

  render () {
    return (
      <MediaContextProvider>
        <Media at="sm">
          {this.renderMobileApp()}
        </Media>
        <Media at="md">
          {this.renderMobileApp()}
        </Media>
        <Media greaterThanOrEqual="lg">
          {this.renderDesktopApp()}
        </Media>
      </MediaContextProvider>
    )
  }
}

export default App;