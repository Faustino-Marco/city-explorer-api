'use strict';

// require
let express = require('express');
let app = 
// use 
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

// routes 
app.get('/', (req, res) => {
  res.status(200).send('Hello there!');
});

app.get('*', (req, res) => {
  res.status(404).send('These are not the droids you\'re looking for');
})
// classes 

// errors 
app.use((error, req, res, next) => {
  console.log(error.message);
}
// listen
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));