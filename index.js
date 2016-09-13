'use strict';

// Edit repo provided mysql_config-example.json and rename to mysql_config.json
var mysqlconf = require('./mysql_config.json');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host      : mysqlconf.host,
  port      : mysqlconf.port,
  user      : mysqlconf.username,
  password  : mysqlconf.password,
  database  : mysqlconf.database
});

exports.handler = (event, context, callback) => {
    console.log('Loading Lambda Function');

    console.log('Received event: ', JSON.stringify(event, null, 2));   //DEBUG

    // Connect to MySQL
    function connectDB(err, callback) {
      if(err) {
      console.error("connectDB error: "+err);
      } else {
        connection.connect(function(err) {
          if(err) {
            console.log("DB Connection error:: "+err);
            //context.fail();
          } else {
            console.log("DB Connected.");
            callback(null, endDB);
          }
        });
      }
    }

    // Query the DB. 'SHOW TABLES' used simply to test connetivity.
    function queryDB(err, callback) {
      if(err) {
        console.error("queryDB error: "+err);
      } else {
        connection.query('SHOW TABLES', function (err, results, fields) {
          if(err) {
            console.log("DB Query error:: "+err);
          } else {
            console.log("Tables found: "+results.length);
            console.log("Results: "+JSON.stringify(results, null, 2));
            callback(null);
          }
        });
      }
    }

    // Close MySQL connection
    function endDB(err, callback) {
      if(err) {
        console.error("endDB error: "+err);
      } else {
        connection.end(function(err) {
          if(err) {
            console.log("DB connection.end failed:: "+err);
            context.fail();
          } else {
            console.log("DB Connected ended.");
            context.done();
          }
        });
      }
    }

    // Begin the chain
    connectDB(null, queryDB);

    //callback(null);
    //context.done();
}
