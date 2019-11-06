const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/queries');
const employeeData = require('./routers/employees');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(employeeData);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}`));
