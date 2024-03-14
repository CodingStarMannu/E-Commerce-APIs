const express = require('express');
const app = express();
require('./config/mongoose');
const cors = require('cors');


app.use(cors());

const port =  3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));


app.listen(port,(error)=>{
    if(error){
        console.log(`Error in running Server, Error: ${error}`);
    }
    console.log(`Server is running on port ${port}`);

})