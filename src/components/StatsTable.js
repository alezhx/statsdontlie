import React from 'react'
import {Table} from'semantic-ui-react'

const StatsTable = ({statKeys, preStats, postStats}) => {
  let cleanedStatKeys = statKeys.flatMap( (key) => 
    key.includes("_") ? [key.replace("_","").toUpperCase()] :
    (key === "turnover") ? ["TO"] :
    (key === "fga") ? ["FG"] :
    (key === "fg3a") ? ["FG3"] :
    (key === "fta") ? ["FT"] :
    (key === "fgm") ? [] :
    (key === "fg3m") ? [] :
    (key === "ftm") ? [] : 
    [key.toUpperCase()]
  )
  for (const el in preStats) {
    if (el.includes("_")) {
      preStats[el.replace("_","").toUpperCase()] = preStats[el]
    } else if (el === "turnover") {
      preStats["TO"] = preStats[el];
    } else {
      preStats[el.toUpperCase()] = preStats[el];
    }
  }
  for (const el in postStats) {
    if (el.includes("_")) {
      postStats[el.replace("_","").toUpperCase()] = postStats[el]
    } else if (el === "turnover"){
      postStats["TO"] = postStats[el]
    } else {
      postStats[el.toUpperCase()] = postStats[el];
    }
  }
  preStats["FG"] = `${preStats["fgm"]} / ${preStats["fga"]}`
  preStats["FG3"] = `${preStats["fg3m"]} / ${preStats["fg3a"]}`
  preStats["FT"] = `${preStats["ftm"]} / ${preStats["fta"]}`
  postStats["FG"] = `${postStats["fgm"]} / ${postStats["fga"]}`
  postStats["FG3"] = `${postStats["fg3m"]} / ${postStats["fg3a"]}`
  postStats["FT"] = `${postStats["ftm"]} / ${postStats["fta"]}`

  return (
    <Table celled color={'black'} inverted selectable collapsing>
      <Table.Header>
        <Table.Row textAlign='center'>
          <Table.HeaderCell inverted collapsing></Table.HeaderCell>
          {cleanedStatKeys.map((key) => {
            let stat = key.includes("PCT") ? key.replace('PCT','%'): key
            return <Table.HeaderCell collapsing> {stat} </Table.HeaderCell>
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row textAlign='center'>
          <Table.Cell>
            Pre-Bubble
          </Table.Cell>
          {cleanedStatKeys.map((key) => {
              return <Table.HeaderCell collapsing> {preStats[key]} </Table.HeaderCell>
          })}
        </Table.Row>
        <Table.Row textAlign='center'>
          <Table.Cell>
            In Bubble
          </Table.Cell>
          {cleanedStatKeys.map((key) => {
            return <Table.HeaderCell collapsing> {postStats[key]} </Table.HeaderCell>
          })}
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default StatsTable