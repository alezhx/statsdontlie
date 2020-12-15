import React, { Component } from 'react';
import {
  Header,
  Container,
  Icon,
} from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import ReactPlayer from 'react-player';
import PlayerSearch from 'components/PlayerSearch';
import StatsTable from 'components/StatsTable';
import NoStats from 'views/desktop/NoStats';
import LoadingSpinner from 'components/LoadingSpinner';
import UtilTools from 'utils/UtilTools';
import ResultsLogo from 'static/ResultsLogo.png';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  searchBarOuterContainer: {
    position:'sticky',
    padding: 15,
    display:'flex', 
    justifyContent:'center', 
    top:'0px', 
    backgroundColor:'#dfe6e9', 
    width:'100%', 
    boxShadow: "2px 2px 15px black",
    alignItems:'center'
  },
  searchBarInnerDiv: {
    height:'100%',
    paddingRight:10
  },
  logo: {
    objectFit : 'contain',
    width: 225,
    height:'100%'
  },
  searchBar: {
    width:'100%', 
    display:'inline-block'
  },
  playerStatsContainer: {
    display:'flex',
    justifyContent:'center', 
    boxShadow: "3px 3px 3px #000000",
  },
  videoHighlightsMainDiv: {
    display:'flex', 
    flexDirection:'column', 
    justifyContent:'center', 
    alignItems:'center', 
    marginTop:60,
  },
  videoHighlightsDiv: {
    padding:36,
    backgroundColor:'#0984e3',
    color:'white',
    paddingTop:20,
    borderRadius:15,
    boxShadow: "5px 5px 5px #000000",
  },
  videoHeader: {
    fontSize: '3em',
    textShadow: "2px 2px 2px black",
    fontFamily: 'ProximaSemiBold',
    margin:0
  },
  quickStatsName: {
    fontSize: '3em',
    fontWeight: 'bold',
    marginTop: '.5em',
    borderBottom: '1px solid white',
    fontFamily: 'ProximaBold, serif',
  },
  quickStatsOutterDiv: {
    display:'flex', 
    justifyContent:'center', 
    marginTop:20, 
    marginBottom:50,
  },
  quickStatsDivs: {
    width:'30%',
    backgroundColor:'#0984e3',
    display:'flex', 
    alignItems:'center',
    flexDirection:'column',
    color:'white',
    boxShadow: "3px 3px 3px #000000",
  },
  quickStatsTitles: {
    fontSize: '3em',
    textShadow: "2px 2px 2px black",
    fontFamily: 'ProximaSemiBold, serif',
    paddingTop:30,
  },
  statsDiv: {
    width:'100%', 
    padding:30, 
    display:'flex', 
    justifyContent:'space-between', 
    alignItems:'center', 
    flexDirection:'column', 
    fontSize:'2em', 
    fontFamily:'ProximaRegular', 
    height:'100%',
  },
  statDiv: {
    display:'flex', 
    flexDirection:'row', 
    width:'100%'
  },
  statLabel: {
    width:'50%', 
    textAlign:'end', 
    paddingRight:15
  },
  stat: {
    width:'50%', 
    fontSize:'1.125em', 
    fontWeight:'bold'
  },
  quickStatsImgDiv: {
    width:'40%', 
    textAlign:'center', 
    height:500,
  },
  quickStatsImg: {
    display:'block', 
    width:'100%', 
    height:'100%', 
    objectFit:'cover', 
    objectPosition:'50% 0%', 
    boxShadow: "3px 3px 3px #000000",
  },

})
class PlayerStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preStats: {},
      postStats: {stats:0},
      playerImageLink: '',
      playerHighlights: '',
      isLoading: true,
    }
  };

  componentDidMount = () => {
    this.loadAllStatActions()
  }

  loadAllStatActions = () => {
    this.setState({isLoading:true, playerImageLink:""})
    this.loadBubbleStats(this.props.playerId)
    this.loadPreBubbleStats(this.props.playerId)
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => { 
    if(prevProps.playerId !== this.props.playerId) {
      this.loadAllStatActions()
    }
  }

  loadPreBubbleStats = async(player_id) => {
    const { data } = await axios.get('https://www.balldontlie.io/api/v1/stats', {
      params: {
        seasons: 2019,
        player_ids: [player_id],
        start_date: "2019-10-22",
        end_date: "2020-03-12",
        per_page: 100
      }
    })

    let cleanStats = {}

    if (!(_.isEmpty(data.data))) {
      cleanStats = UtilTools.getStatAverages(data)
    }

    this.setState({preStats:cleanStats})
  }

  loadBubbleStats = async(player_id) => {
    const { data } = await axios.get('https://www.balldontlie.io/api/v1/stats', {
      params: {
        seasons: 2019,
        player_ids: [player_id],
        start_date: "2020-07-30",
        end_date: "2020-10-12",
        per_page: 100
      }
    })

    let cleanStats = {}

    if (!(_.isEmpty(data.data))) {
      cleanStats = UtilTools.getStatAverages(data)
    }

    this.setState({postStats:cleanStats}, () => {
      if (!(_.isEmpty(this.state.postStats))) {
        this.getPlayerImage(this.props.playerName)
        this.getPlayerHighlights(this.props.playerName)
      }
    })
  }

  renderSearchBar = () => {
    return (
      <Container className={css(styles.searchBarOuterContainer)}>
        <div className={css(styles.searchBarInnerDiv)}>
          <a href="">            
            <img 
              className={css(styles.logo)}
              src = {ResultsLogo}
              alt = "Logo"
            />
          </a>
        </div>
        <div className={css(styles.searchBar)}>
        <PlayerSearch addPlayerId={this.props.changePlayerId}/>
        </div>
      </Container>
    )
  }

  getPlayerImage = async(playerName) => {
    try {
      const {data} = await axios.get('https://www.googleapis.com/customsearch/v1?', {
        params: {
          key: process.env.REACT_APP_GOOGLE_API_KEY,
          cx: process.env.REACT_APP_GOOGLE_CX,
          imgSize: "XLARGE",
          num: 5,
          q: playerName,
          safe: "active",
          searchType: "image",
          dateRestrict: "m[6]"
        }
      }) 
      this.setState({playerImageLink: data.items[0].link,
        image: {
          height: data.items[0].image.height,
          width: data.items[0].image.width
        }
      })
    } catch (error) {
      console.log('Image API error', error)
    }
  }

  getPlayerHighlights = async(playerName) => {
    try {
      const {data} = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.REACT_APP_GOOGLE_API_KEY,
          part: "snippet",
          maxResults: 5,
          q: playerName + " Highlights",
          publishedBefore: "2020-10-26T00:00:00Z",
          publishedAfter: "2020-01-01T00:00:00Z"
        }
      })
      this.setState({playerHighlights: "www.youtube.com/watch?v=" + data.items[0].id.videoId})
    } catch(error) {
      console.log('Video API error', error)
    }
  }

  renderPlayerStats = () => {
    let statCategories = ["fga", "fgm", "fg_pct", "fg3a", "fg3m", "fg3_pct", "fta", "ftm", "ft_pct", "oreb", "DREB" ,"reb", "ast", "blk", "stl", "pf", "turnover", "pts"]

    return (
      <div>
        {this.renderImageQuickStats()}
        <Container>
          <div className={css(styles.playerStatsContainer)}>
            <StatsTable statKeys={statCategories} preStats={this.state.preStats} postStats={this.state.postStats}/>
          </div>
          {this.renderVideoHighlights()}
        </Container>
      </div>
    )
  }

  renderVideoHighlights = () => {
    if (this.state.playerHighlights) {
      return (
        <div className={css(styles.videoHighlightsMainDiv)}>
          <div 
            className={css(styles.videoHighlightsDiv)}
          >
            <Header
              content="PLAYER HIGHLIGHTS"
              inverted
              className={css(styles.videoHeader)}
            />
            <ReactPlayer url = {this.state.playerHighlights}/> 
          </div>
          <div style={{height:60}}/>
        </div>
      )
    } else {
      return (
        <div style={{height:60}}/>
      )
    }
  }

  renderImageQuickStats = () => {
    let {preStats, postStats} = this.state

    let differences = {
      pts: postStats.pts - preStats.pts,
      reb: postStats.reb - preStats.reb,
      ast: postStats.ast - preStats.ast,
      fg_pct: postStats.fg_pct - preStats.fg_pct,
      to: postStats.turnover - preStats.turnover
    }

    const IncreaseIcon = () => <Icon name="caret up" style={{color:"#00ff00"}}/>
    const DecreaseIcon = () => <Icon name="caret down" color="red"/>

    const TO_IncreaseIcon = () => <Icon name="caret up" color="red"/>
    const TO_DecreaseIcon = () => <Icon name="caret down" style={{color:"#00ff00"}}/>

    return (
      <Container style={{minHeight:500}}>
        <div>
          <Header
            as='h1'
            content={this.props.playerName}
            inverted
            className={css(styles.quickStatsName)}
          />
        </div>
        <div className={css(styles.quickStatsOutterDiv)}>
          <div 
            className={css(styles.quickStatsDivs)}
            style={{
              borderBottomLeftRadius: 15,
              borderTopLeftRadius: 15,
            }}
            >
            <Header
              content="PRE-BUBBLE '19-20"
              inverted
              className={css(styles.quickStatsTitles)}
            />
            <div
              className={css(styles.statsDiv)}
            >
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>PTS</div>
                <div className={css(styles.stat)}>{preStats.pts}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>REB</div>
                <div className={css(styles.stat)}>{preStats.reb}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>AST</div>
                <div className={css(styles.stat)}>{preStats.ast}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>FG</div>
                <div className={css(styles.stat)}>{preStats.fg_pct}%</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>TO</div>
                <div className={css(styles.stat)}>{preStats.turnover}</div>
              </div>
            </div>
          </div>
          <div className={css(styles.quickStatsImgDiv)}>
            <img 
              onLoad={() => this.state.playerImageLink && this.setState({isLoading:false})}
              src={this.state.playerImageLink} 
              className={css(styles.quickStatsImg)}
              loading='lazy'
              alt = "brb using imagination since no pics"
            />
          </div>
          <div 
            className={css(styles.quickStatsDivs)}
            style={{
              borderBottomRightRadius: 15,
              borderTopRightRadius: 15,
            }}
          >        
            <Header
              content="BUBBLE '20"
              inverted
              className={css(styles.quickStatsTitles)}
            />
            <div
              className={css(styles.statsDiv)}
            >
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>PTS</div>
                <div className={css(styles.stat)}>{postStats.pts}{differences.pts>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>REB</div>
                <div className={css(styles.stat)}>{postStats.reb}{differences.reb>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>AST</div>
                <div className={css(styles.stat)}>{postStats.ast}{differences.ast>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>FG</div>
                <div className={css(styles.stat)}>{postStats.fg_pct}%{differences.fg_pct>0 ? <IncreaseIcon/> : <DecreaseIcon/>}</div>
              </div>
              <div className={css(styles.statDiv)}>
                <div className={css(styles.statLabel)}>TO</div>
                <div className={css(styles.stat)}>{postStats.turnover}{differences.to>0 ? <TO_IncreaseIcon/> : <TO_DecreaseIcon/>}</div>
              </div>
            </div>
          </div>
        </div>
        </Container>
    )
  }

  onLoadDone = () => {
    this.setState({isLoading:false})
  }

  renderNoStatsPage = () => {
    return (
      <NoStats 
        playerName = {this.props.playerName} 
        onLoadDone = {this.onLoadDone}
      />
    )
  }   

  renderLogic = () => {
    if(_.isEmpty(this.state.postStats)) {
      return this.renderNoStatsPage()
    } else {
      return this.renderPlayerStats()
    }
  }

  render() {
    return (
      <div 
        key={this.props.playerId + this.props.playerName} 
        style={{backgroundColor:'#2d3436'}}
      >
        {this.renderSearchBar()}
          <div>
            <LoadingSpinner active={this.state.isLoading}/>
            {this.renderLogic()}
          </div>
      </div>
    )
  }
}

export default PlayerStats