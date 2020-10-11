import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
// import nba from 'nba-api-client'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import HomepageLayout from './views/Homepage'

const nba = require('nba-api-client');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  };

  componentDidMount() {
    nba.teamPlayerStats({TeamID: 1610612745, MeasureType: 'Advanced', Season: '2017-18', SeasonType: 'Playoffs'}).then(function(data){
      this.setState({data})
    }).catch(error => console.log(error))
  }

  test = () => {
    nba.teamPlayerStats({
      "PlayerID":201935,
      "TeamID":1610612745,
      "Season": '2019', 
      "SeasonType": 'Playoffs'
    }).then(data=>console.log('est', data))
  }

  render () {
    return (
    //   <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn Ball
    //     </a>
    //     <p>
    //       TEST DATA HERE: {JSON.stringify(this.state.data)}
    //     </p>
    //     <button
    //       onClick={()=>{
    //         // alert(JSON.stringify(nba.getPlayerID("James Harden")))
    //         // test()
    //         // nba.teamPlayerStats({TeamID: 1610612745, MeasureType: 'Advanced', Season: '2017-18', SeasonType: 'Playoffs'}).then(function(data){
    //         //   console.log(data)
    //         // })
    //         // axios.get(`https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2019-20/league/00_full_schedule_week.json`)
    //         // .then(function(res){
    //         //   console.log(res.data)
    //         // })
    //         // console.log(nba.getPlayerHeadshotURL({PlayerID: 201935, TeamID: 1610612745}))
    //       }}
    //     >
    //       Test button
    //     </button>
    //   </header>
    // </div>
    <HomepageLayout />
    )
  }
}

export default App;