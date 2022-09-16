const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes')
require('./database');

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '5000kb' }));

app.use(router);

app.listen(3001, () => {
    console.log("<><><> drive-service is running on port 3001 <><><>")
})