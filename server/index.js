const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(process.cwd(), '.env') });

const indexRouter = require('./routes');
const app = express();

const cors = require('cors');
app.use(cors());
app.options('*', cors());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.metaHeader = {
    ip: req.ip,
    'user-agent': req.headers['user-agent'],
    token: req.headers['x-access-token'] || req.headers.authorization,
  };
  req.context = {
    method: req.baseUrl + req.url,
    service: 'api-merchant',
  };
  next();
});

app.use((req, res, next) => {
  if (!req.is('application/octet-stream')) {
    return next();
  }
  /* List of Buffer objects */
  let data = [];
  req.on('data', function (chunk) {
    /* Append Buffer object */
    data.push(chunk);
  });
  req.on('end', function () {
    if (data.length <= 0) {
      return next();
    }
    /* Make one large Buffer of it */
    data = Buffer.concat(data);
    req.raw = data;
    return next();
  });
});

app.use('/api', indexRouter);

/* catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createError(404, 'api not found'));
});

/* error handler */
// app.use(function (err, req, res, next) {
//   /* set locals, only providing error in development */
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   /* render the error page */
//   res.status(err.status || 500);
//   res.send({ message: err.message || 'error' });
// });

module.exports = app;
