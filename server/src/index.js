const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');

require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', require('./routes/auth'));

// Server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
