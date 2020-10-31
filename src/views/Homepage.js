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
        // backgroundColor: "#1b1c1d"
      }}>
        <Menu inverted secondary>
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
            fitted = "true"
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
              style = {{
                padding:0.5
              }}
          />
        </Menu>
        <div style = {{
          // backgroundColor: "#1b1c1d",
          minHeight: "100VH",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Container text>
            <Header
              as='h1'
              content='BubbleStats'
              inverted
              style={{
                fontSize: '4em',
                fontWeight: 'normal',
              }}
              textAlign = 'center'
            />
            <Header
              as='h2'
              content='Search for a player to find detailed NBA bubble stats'
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

//   render () {
//     return (
//       <MediaContextProvider>
//         <Media greaterThan='mobile'>
//           <Container text>
//             <Header
//               as='h1'
//               content='BubbleStats'
//               inverted
//               style={{
//                 fontSize: this.props.mobile ? '2em' : '4em',
//                 fontWeight: 'normal',
//                 marginBottom: 0,
//                 marginTop: this.props.mobile ? '1.5em' : '3em',
//               }}
//             />
//             <Header
//               as='h2'
//               content='Search for a player to find detailed NBA bubble stats'
//               inverted
//               style={{
//                 fontSize: this.props.mobile ? '1.5em' : '1.7em',
//                 fontWeight: 'normal',
//                 marginTop: this.props.mobile ? '0.5em' : '1.5em',
//               }}
//             />
//             <PlayerSearch  addPlayerId = {this.props.addPlayerId}/>
//           </Container>
//         </Media>
//       </MediaContextProvider>
//     ) 
//   }
// }

