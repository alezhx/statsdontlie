const GSR = require('google-search-results-nodejs');
const client = new GSR.GoogleSearchResults("secret_api_key");

const params = {
  engine: "google",
  ijn: "0",
  q: "tyler herro site:nba.com",
  google_domain: "google.com",
  tbm: "isch",
  safe: "active",
  tbs: "isz:l,qdr:y"
};

const callback = function(data) {
  console.log(data);
};

// Show result as JSON
client.json(params, callback);