import React from 'react'
import {
  Container,
  Header
} from 'semantic-ui-react'

const NoStats = () => ( 
  <Container style={{width:'80%', display:'flex', justifyContent:'center'}}>
    <div> 
      <Header
        as='h1'
        content='This player did not play in the bubble'
        inverted
        style={{
          fontSize: '3em',
          fontWeight: 'normal',
        }}
        textAlign = 'center'
      />
      <div style={{display:'flex', justifyContent:'center'}}>
          <div style={{display:'flex', justifyContent:'center', height:500, width:500}}>
            <img
              style={{
                objectFit : 'contain',
              }}
              src = "https://i.kym-cdn.com/entries/icons/facebook/000/017/966/jordan-crying.jpg"
              alt = "sad Jordan"
            />
          </div>
        </div>
      <Header
        as='h2'
        content='There are no stats to show. Please search again'
        inverted
        style={{
          fontSize: '3em',
          fontWeight: 'normal',
        }}
        textAlign = 'center'
      />
    </div>
  </Container>
)

export default NoStats