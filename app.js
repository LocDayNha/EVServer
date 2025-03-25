var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose');

require("./components/brand/BrandModel");
require("./components/brandCar/BrandCarModel");
require("./components/car/CarModel");
require("./components/location/LocationModel");
require("./components/port/PortModel");
require("./components/rating/RatingModel");
require("./components/services/ServicesModel");
require("./components/specification/SpecificationModel");
require("./components/station/StationModel");
require("./components/user/UserModel");
require("./components/vehicle/VehicleModel");

var brandRouter = require("./routes/api/BrandAPI");
var brandCarRouter = require("./routes/api/BrandCarAPI");
var carRouter = require("./routes/api/CarAPI");
var locationRouter = require("./routes/api/LocationAPI");
var portRouter = require("./routes/api/PortAPI");
var ratingRouter = require("./routes/api/RatingAPI");
var servicesRouter = require("./routes/api/ServicesAPI");
var specificationRouter = require("./routes/api/SpecificationAPI");
var stationRouter = require("./routes/api/StationAPI");
var userRouter = require("./routes/api/UserAPI");
var vehicleRouter = require("./routes/api/VehicleAPI");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect database
//mJ7Czq3K9ECbfoCU
mongoose.connect('mongodb+srv://locdaynha:mJ7Czq3K9ECbfoCU@evdata.jbycp.mongodb.net/?retryWrites=true&w=majority&appName=EVData')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/brand', brandRouter);
app.use('/brandcar', brandCarRouter);
app.use('/car', carRouter);
app.use('/location', locationRouter);
app.use('/port', portRouter);
app.use('/rating', ratingRouter);
app.use('/services', servicesRouter);
app.use('/specification', specificationRouter);
app.use('/station', stationRouter);
app.use('/user', userRouter);
app.use('/vehicle', vehicleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
