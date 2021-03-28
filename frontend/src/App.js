import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import Homepage from 'views/desktop/Homepage';
import PlayerStats from 'views/desktop/PlayerStats';
import { createMedia } from "@artsy/fresnel";
import { MediaTypes } from 'utils/Enum';
import axios from 'axios';


const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 768,
    // lg: 1024,
    lg: 992
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

  renderHomePage = (media) => {
    return <Homepage addPlayerId = {this.addPlayerId} media={media}/>
  }

  addPlayerId = (playerId, playerName, cb) => {
    this.setState({playerId, playerName}, () => cb && cb)
  }

  removePlayerId = (cb) => {
    this.setState({playerId : null, playerName: ''}, () => cb && cb)
  }

  renderStatsPage = (playerId, playerName, media) => {
    return <PlayerStats 
            playerId = {playerId} 
            playerName = {playerName}
            removePlayerId = {this.removePlayerId} 
            changePlayerId = {this.addPlayerId}
            media = {media}
          />
  }
  renderApp = (media) => 
    <div>
      {this.state.playerId ? this.renderStatsPage(this.state.playerId, this.state.playerName, media) : this.renderHomePage(media)}
    </div>

  render () {
    return (
      <MediaContextProvider>
        <Media at="sm">
          {this.renderApp(MediaTypes.mobile)}
        </Media>
        <Media at="md">
          {this.renderApp(MediaTypes.tablet)}
        </Media>
        <Media greaterThanOrEqual="lg">
          {this.renderApp(MediaTypes.desktop)}
        </Media>
      </MediaContextProvider>
    )
  }
}

export default App;