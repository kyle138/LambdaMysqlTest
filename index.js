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
    connection.connect(function(err) {
      if(err) {
        console.log("DB Connection error:: "+err);
        context.fail();
      } else {
        console.log("DB Connected.");
      }
    });

    // Query the DB. 'SHOW TABLES' used simply to test connetivity.
    connection.query('SHOW TABLES', function (err, results, fields) {
      if(err) {
        console.log("DB Query error:: "+err);
      } else {
        console.log("Results: "+JSON.stringify(results, null, 2));
      }
    });

    // Close MySQL connection
    connection.end(function(err) {
      if(err) {
        console.log("DB connection.end failed:: "+err);
        context.fail();
      } else {
        console.log("DB Connected ended.");
        context.done();
      }
    });

    //callback(null);
    //context.done();
}
