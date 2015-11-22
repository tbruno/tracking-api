/**
 * Created by tomasbruno on 11/22/15.
 */


var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DriverSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Driver', DriverSchema);