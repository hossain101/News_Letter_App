const express  = require('express');

const app  = express();

app.get('',(_req,_res)=>{
    _res.send('Hello Express');
});



















app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});