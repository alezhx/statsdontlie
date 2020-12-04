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
        {/* <a onClick={() => this.toggleSideBar(false)}> */}
        <a compact onClick={() => this.toggleSideBar(false)} style={{position:'absolute', top:15,right:10,color:'white', zIndex:999, backgroundColor:'transparent'}} >
          <Icon 
            name="times circle" 
            // style={{position:'absolute', top:15,right:10,color:'white'}} 
            fitted 
            size="large"
            // onClick={() => this.toggleSideBar(false)}
          />
        </a>
        <Menu.Item active style={{padding:20, fontSize:'1.5em'}}>
          About this project
        </Menu.Item>
        <Menu.Item style={{lineHeight:'1.5em'}}>
        During the 2019 - 2020 season, the NBA was forced to change, due to Covid-19,to protect their players. The NBA eliminated most fan attendance and isolated players during the final eight games of the 2019–20 regular season and throughout the 2020 NBA playoffs. This project aims to compare an NBA player's performance inside and outside the NBA Bubble and observe any statistical changes from playing under these circumstances. We gathered information from games on October 22, 2019 through March 12, 2020 for Pre-Bubble stats and July 30 through October 12, 2020 for stats inside the NBA bubble, using the <a href="https://balldontlie.io" style={{color:'#0984e3'}}>balldontlie API</a>. Averaging these stats from these different pools, we hope to help fans determine for themselves whether or not the NBA bubble made a difference within a player's performance for an unprecedented year.
        </Menu.Item>
      </Sidebar>

  render () {
    return (
      <div style = {{
        minHeight: "100vh",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Button 
          compact
          inverted
          style={{position:'absolute', top:20,left:20}}
          onClick={()=>this.toggleSideBar(true)}
        >
          About
        </Button>
        {this.renderSideBar()}
        <Menu inverted secondary style={{position:'absolute', top:0, right:10}}>
          <Menu.Item
            style = {{
              padding: 0,
              margin: 0
            }}
          >
            Made by
          </Menu.Item>
          <Menu.Item 
            as='a'
            name="Alex"
            href="https://github.com/alezhx/"
            fitted
          />
          <Menu.Item
            style = {{
              padding: 0,
              margin: 0
            }}
          >
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
              content="STATS DON'T LIE 🏀"
              inverted
              style={{
                fontSize: '5em',
                fontWeight: 'normal',
                fontFamily: 'Proxima, serif',
                margin:0
              }}
              textAlign = 'center'
            />
            <Header
              content="Search for a player's stats inside and out the NBA bubble"
              inverted
              style={{
                fontSize: '1.75em',
                fontWeight: 'normal',
                marginBottom: 15,
                marginTop:0,
                fontStyle: 'italic'
              }}
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