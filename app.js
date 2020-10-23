const express = require('express')
const app = express()
const port = 3000

const path = require('path');
const fs = require('fs');

const original_path = path.join(__dirname, 'screenshots');

app.get('/', (req, res) => {
  let images = []
  fs.readdir(original_path, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
      images.push(file)
      console.log(file);
    });
    console.log(images)

    res.json(files)

  });
  // res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})