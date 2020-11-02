import React from 'react'
import {Table} from'semantic-ui-react'

const StatsTable = ({statKeys, preStats, postStats}) => (
  <Table celled color={'black'} inverted selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell inverted collapsing></Table.HeaderCell>
              {statKeys.map((key) => {
                  let stat = key.toUpperCase();
                  if (stat.includes("_")) {
                    stat = stat.replace("_","")
                  }
                  return <Table.HeaderCell collapsing> {stat} </Table.HeaderCell>
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Pre-Bubble
              </Table.Cell>
              {statKeys.map((key) => {
                  return <Table.HeaderCell collapsing> {preStats[key]} </Table.HeaderCell>
              })}
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                In Bubble
              </Table.Cell>
              {statKeys.map((key) => {
                  return <Table.HeaderCell collapsing> {postStats[key]} </Table.HeaderCell>
              })}
            </Table.Row>
          </Table.Body>
        </Table>
)

export default StatsTable