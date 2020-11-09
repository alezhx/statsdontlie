const UtilTools = {
  getStatAverages(response) {
    let onlyStats = response.data;
    let compressedStats = {}
    for (let i = 0; i < onlyStats.length; i++){
      for (const key in onlyStats[i]) {
        if (key !== 'game' && key !== 'min' && key !== 'player' && key !== 'team' && key !== 'id') {
          compressedStats[key] = compressedStats[key] ? (compressedStats[key] + onlyStats[i][key]) : onlyStats[i][key]
        }
      }
    }
    let totalfgm = compressedStats['fgm'];
    let totalfga = compressedStats['fga'];
    let totalfg3a = compressedStats['fg3a'];
    let totalfg3m = compressedStats['fg3m'];
    let totalfta = compressedStats['fta'];
    let totalftm = compressedStats['ftm'];
    
    for (const key in compressedStats) {
      compressedStats[key] = (compressedStats[key] / onlyStats.length).toFixed(1);
      if (key === 'fg_pct') {
        compressedStats[key] = ((totalfgm / totalfga) * 100).toFixed(1);
      }
      if (key === 'fg3_pct') {
        compressedStats[key] = ((totalfg3m / totalfg3a) * 100).toFixed(1);
      }
      if (key === 'ft_pct') {
        compressedStats[key] = ((totalftm / totalfta) * 100).toFixed(1);
      }
    }
    compressedStats['DREB'] = compressedStats['reb'] - compressedStats['oreb']
    return compressedStats;
  }
}

export default UtilTools