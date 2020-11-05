import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Visibility,
} from 'semantic-ui-react'
// import Search from '../components/Search'
import PlayerSearch from '../components/PlayerSearch';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render () {
    return (
      <div style = {{
        minHeight: "100vh",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Menu inverted secondary style={{position:'absolute', top:0, right:10}}>
          <Menu.Item
            position = 'right'
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
            href=""
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
              href="https://www.google.com"
              fitted
          />
        </Menu>
        <div>
          <Container text>
            <Header
              as='h1'
              content="stats don't lie 🏀"
              inverted
              style={{
                fontSize: '4em',
                fontWeight: 'normal',
              }}
              textAlign = 'center'
            />
            <Header
              as='h2'
              content="Search for a player's stats inside and out the NBA bubble"
              inverted
              style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginTop: '.5em',
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