// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Driver     = require('./app/model/driver');


// Connect to the db!
mongoose.connect('mongodb://localhost/tracking');
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Database connection opened")
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/drivers')

    // create a bear (accessed at POST http://localhost:8080/api/drivers)
    .post(function(req, res) {

        var driver = new Driver();
        driver.name = req.body.name;

        // save the bear and check for errors
        driver.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Driver created!' });
        });
    })

    .get(function(req, res) {
        Driver.find(function(err, drivers) {
            if (err)
                res.send(err);

            res.json(drivers);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/drivers/:driver_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/drivers/:driver_id
    .get(function(req, res) {
        Driver.findById(req.params.driver_id, function(err, driver) {
            if (err)
                res.send(err);
            res.json(driver);
        });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/drivers/:driver_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Driver.findById(req.params.driver_id, function(err, driver) {

            if (err)
                res.send(err);

            driver.name = req.body.name;  // update the bears info

            // save the bear
            driver.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Driver updated!' });
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/driver/:driver_id)
    .delete(function(req, res) {
        Driver.remove({
            _id: req.params.driver_id
        }, function(err, driver) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);