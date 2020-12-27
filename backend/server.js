const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

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
        key: 'AIzaSyAOVnJrIjYL3O23-CgXcYIX9laBe7MdcnY',
        cx: '6d5cc39ca7f4caaae',
        imgSize: "XLARGE",
        num: 5,
        q: PlayerName,
        safe: "active",
        searchType: "image",
        dateRestrict: "m[6]"
      }
    }) 

    res.json({data})
  } catch (error) {
    console.log('Image API error', error)
  }
})


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 7000;
app.listen(port);

console.log('App is listening on port ' + port);