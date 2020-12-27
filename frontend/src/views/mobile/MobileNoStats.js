import React from 'react';
import {
  Container,
  Header
} from 'semantic-ui-react';
import jordan from 'static/jordan-crying.jpg';
import kobepic from 'static/kobe.jpg';

const MobileNoStats = (props) => {
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
    <Container style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%', overflow:'hidden'}}>
      <div style={{width:'100%'}}> 
        <Header
          content={props.playerName === "Kobe Bryant" ? kobe.h1 : noStats.h1}
          inverted
          style={{
            fontSize: '8vw',
            fontWeight: 'normal',
            marginTop: '.5em',
            fontFamily: 'ProximaBold, serif',
          }}
          textAlign = 'center'
        />
        <div style={{display:'flex', justifyContent:'center',width:'100%'}}>
            <div style={{display:'flex', justifyContent:'center', height:'45vh', width:'100%'}}>
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
          content= {props.playerName === "Kobe Bryant" ? kobe.h2 : noStats.h2}
          inverted
          style={{
            fontSize: '8vw',
            fontWeight: 'normal',
            fontFamily: 'ProximaBold, serif',
          }}
          textAlign = 'center'
        />
      </div>
    </Container>
  )
}

export default MobileNoStats