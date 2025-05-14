const express = require ('express');
const app = express();
const cors = require ('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false}));

//CRUD


//CREATE
app.post('/insertt', ( request , response ) => {
    console.log(request.body);
});

//READ
app.get('/getAll', ( request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
  .then(data = response.json({data :data}))
  .catch(err => console.log(err));
  
});

//UPDATE


//DELETE

app.listen(process.env.PORT, () => console.log('app est active'));