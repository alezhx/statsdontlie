import React, { Component } from 'react';
import {
  Container,
  Header,
  Menu,
  Sidebar,
  Button,
  Icon
} from 'semantic-ui-react';
import PlayerSearch from 'components/PlayerSearch';
import { StyleSheet, css } from 'aphrodite';
import { MediaTypes } from 'utils/Enum';

const styles = StyleSheet.create({
  main: {
    minHeight: "100vh",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeSidebarIcon: {
    position:'absolute', 
    top:15,right:10,
    color:'white', 
    zIndex:999, 
    backgroundColor:'transparent'
  },
  sidebarHeaderContainer: {
    padding:20, 
    fontSize:'1.5em'
  },
  aboutInfo: {
    lineHeight:'1.5em'
  },
  aboutButton: {
    position:'absolute', top:20,left:20
  },
  menu: {
    position:'absolute', top:0, right:10
  },
  fitted: {
    padding: 0,
    margin: 0
  },
  header1: {
    fontSize: '5em',
    fontWeight: 'normal',
    fontFamily: 'Proxima, serif',
    margin:0
  },
  header2: {
    fontSize: '1.75em',
    fontWeight: 'normal',
    marginBottom: 15,
    marginTop:0,
    fontStyle: 'italic'
  }
});

const mobileStyles = StyleSheet.create({
  main: {
    minHeight: "90vh",
    maxHeight: "100vh",
    position:'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'hidden',
  },
  header1: {
    fontSize: '12vw',
    fontWeight: 'normal',
    fontFamily: 'Proxima, serif',
    margin:0
  },
  header2: {
    fontSize: '5vw',
    fontWeight: 'normal',
    marginBottom: 15,
    marginTop:0,
    fontStyle: 'italic'
  }
});


class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      sideBarOpened: false
    }
  }

  toggleSideBar = (bool) => {
    this.setState({sideBarOpened:bool})
  }

  renderSideBar = () => 
      <Sidebar
        as={Menu}
        animation='overlay'
        inverted
        onHide={() => this.toggleSideBar(false)}
        vertical
        visible={this.state.sideBarOpened}
      >
        <a className={css(styles.closeSidebarIcon)} onClick={() => this.toggleSideBar(false)} >
          <Icon 
            name="times circle" 
            fitted 
            size="large"
          />
        </a>
        <Menu.Item active className={css(styles.sidebarHeaderContainer)}>
          About this project
        </Menu.Item>
        <Menu.Item className={css(styles.aboutInfo)}>
        During the 2019 - 2020 season, the NBA was forced to change, due to Covid-19, to protect their players. The NBA eliminated most fan attendance and isolated players during the final eight games of the 2019–20 regular season and throughout the 2020 NBA playoffs. This project aims to compare an NBA player's performance inside and outside the NBA Bubble and observe any statistical changes from playing under these circumstances. We gathered information from games on October 22, 2019 through March 12, 2020 for Pre-Bubble stats and July 30 through October 12, 2020 for stats inside the NBA bubble, using the <a href="https://balldontlie.io" style={{color:'#0984e3'}}>balldontlie API</a>. Averaging these stats from these different pools, we hope to help fans determine for themselves whether or not the NBA bubble made a difference within a player's performance for an unprecedented year.
        </Menu.Item>
      </Sidebar>

  renderAboutButton = () => 
    <Button 
      className={css(styles.aboutButton)}
      compact
      inverted
      onClick={()=>this.toggleSideBar(true)}
    >
      About
    </Button>

  render () {
    return (
      <div className={css(this.props.media === MediaTypes.desktop || this.props.media === MediaTypes.tablet ? styles.main : mobileStyles.main)}>
        {this.props.media === MediaTypes.desktop && this.renderAboutButton()}
        {this.props.media === MediaTypes.desktop && this.renderSideBar()}
        <Menu inverted secondary className={css(styles.menu)}>
          <Menu.Item className={css(styles.fitted)}>
            Made by
          </Menu.Item>
          <Menu.Item 
            as='a'
            name="Alex"
            href="https://github.com/alezhx/"
            fitted
          />
          <Menu.Item className={css(styles.fitted)}>
            and
          </Menu.Item>
          <Menu.Item
              name= "Victor"
              as='a'
              href="https://github.com/koipondkeepers"
              fitted
          />
        </Menu>
        <div>
          <Container text>
            <Header
              className={css(this.props.media === MediaTypes.desktop || this.props.media === MediaTypes.tablet ? styles.header1 : mobileStyles.header1)}
              content="STATS DON'T LIE 🏀"
              inverted
              textAlign = 'center'
            />
            <Header
              className={css(this.props.media === MediaTypes.desktop || this.props.media === MediaTypes.tablet ? styles.header2 : mobileStyles.header2)}
              content="Search for a player's stats inside and out the NBA bubble"
              inverted
              textAlign = 'center'
            />
            <PlayerSearch  addPlayerId = {this.props.addPlayerId}/>
          </Container>
        </div>
      </div>
    )
  }
}
  
export default Homepage;