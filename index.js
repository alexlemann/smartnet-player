var express = require('express');
var fs = require('fs');
var path = require('path');
var config = require('./config.json');
var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var scanner = new Db('scanner', new Server(host, port, {}));
var db;

scanner.open(function(err, scannerDb) {
  db = scannerDb;
  scannerDb.authenticate(config.dbUser, config.dbPass, function() {});
});



var app = express()

  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib())
  }
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {

  db.collection('transmissions', function(err, transCollection) {
    calls = [];

    transCollection.find(function(err, cursor) {
      cursor.each(function(err, item) {
        if (item) {
          call = {
            talkgroup: item.talkgroup,
            filename: item.name
          };
          calls.push(calls);
        } else {

          res.render('player', calls);
        }
      });
    });
  });
});
app.listen(3004);