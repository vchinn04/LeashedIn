const express = require('express'); //Line 1
const bodyParser = require('body-parser');

const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

testDict = {
  "vchinn04" : {
    "money": 0,
    "status": "ye..."
  }
};

// create a GET route
app.get('/api/hello', (req, res) => { //Get Event
  res.send({ express: 'Hello from Express' });
});
app.get('/api/ExperienceGetter', (req, res) => { //Get Event
  res.send({ express: 'heye from Express' });
});


app.post('/PostTestEvent', (req, res) => {//Post Event, used to set data on server
  console.log(req.body);

  var inputDict = req.body;
  console.log(inputDict);

  var inputKey = inputDict.dataKey;
  console.log(inputKey);

  var inputValue = inputDict.dataValue;
  console.log(inputValue);

  testDict[inputKey] = inputValue;
  res.send(
    JSON.stringify(testDict),
  );
});

app.listen(port, () => console.log(`Ye, listening on port ${port}`)); //Line 6
