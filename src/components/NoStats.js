import React from 'react';
import {
  Container,
  Header
} from 'semantic-ui-react';
import jordan from 'static/jordan-crying.jpg';
import kobepic from 'static/kobe.jpg';

const NoStats = (props) => {
  let kobe = {
      h1: "Rest in peace Kobe & Gianna.",
      h2: ' "You asked for my hustle, I gave you my heart." ',
      imgSrc: kobepic
    },
    noStats = {
      h1: "This player did not play in the NBA bubble.",
      h2: "There are no stats. Please search again.",
      imgSrc: jordan
    }
    return (
    <Container style={{width:'80%', display:'flex', justifyContent:'center',}}>
      <div> 
        <Header
          as='h1'
          content={props.playerName === "Kobe Bryant" ? kobe.h1 : noStats.h1}
          inverted
          style={{
            fontSize: '3em',
            fontWeight: 'normal',
            marginTop: '.5em',
            fontFamily: 'ProximaBold',
          }}
          textAlign = 'center'
        />
        <div style={{display:'flex', justifyContent:'center'}}>
            <div style={{display:'flex', justifyContent:'center', height:500, width:500}}>
              <img
                onLoad={()=>props.onLoadDone()}
                style={{
                  objectFit : 'contain',
                }}
                src = {props.playerName === "Kobe Bryant" ? kobe.imgSrc : noStats.imgSrc}
                alt = "sad Jordan"
              />
            </div>
          </div>
        <Header
          as='h2'
          content= {props.playerName === "Kobe Bryant" ? kobe.h2 : noStats.h2}
          inverted
          style={{
            fontSize: '3em',
            fontWeight: 'normal',
            fontFamily: 'ProximaBold',
          }}
          textAlign = 'center'
        />
      </div>
    </Container>
  )
}

export default NoStats