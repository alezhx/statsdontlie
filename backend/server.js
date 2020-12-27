const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});


app.post('/api/getPlayerImage', async (req, res) => {
  try {
    const {PlayerName} = req.body

    const {data} = await axios.get('https://www.googleapis.com/customsearch/v1?', {
      params: {
        key: process.env.REACT_APP_GOOGLE_API_KEY,
        cx: process.env.REACT_APP_GOOGLE_CX,
        imgSize: "XLARGE",
        num: 5,
        q: PlayerName,
        safe: "active",
        searchType: "image",
        dateRestrict: "m[6]"
      }
    }) 

    // res.json({data})
    res.send(data)
  } catch (error) {
    console.log('Image API error', error)
  }
})

app.post('/api/getPlayerHighlights', async (req,res) => {
  try {
    const {PlayerName} = req.body

    const {data} = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.REACT_APP_GOOGLE_API_KEY,
        part: "snippet",
        maxResults: 5,
        q: PlayerName + " Highlights",
        publishedBefore: "2020-10-26T00:00:00Z",
        publishedAfter: "2020-01-01T00:00:00Z"
      }
    })
    
    res.send(data)
  } catch(error) {
    console.log('Video API error', error)
  }
})

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../frontend/build/index.html'));
});

const port = process.env.PORT || 7000;
app.listen(port);

console.log('App is listening on port ' + port);