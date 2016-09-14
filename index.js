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

var numTables;

exports.handler = (event, context, eventCallback) => {
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
            numTables = results.length;
            console.log("Tables found: "+numTables);
//            console.log("Results: "+JSON.stringify(results, null, 2));
            callback(null, numTables);
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
            callback(null, numTables);
          }
        });
      }
    }

    // Return the number of tables found
    function rtnNumTables(err, num, callback) {
      if(err) {
        console.error("rtnNumTables error: "+err);
        context.fail(err);
      } else {
        if(!num) {
          console.log("rtnNumTables: !num");
          callback(null,'0');
          context.succeed();
        } else {
          console.log("rtnNumTables: num: "+num);
          eventCallback(null,num.toString());
          context.succeed();
        }
      }
    }
    // Begin the chain
    //connectDB(null, queryDB); // Uses mysql connection.connect and connect.end
    queryDB(null, rtnNumTables);  // Does NOT use mysql connect.connect and connect.end


    //context.done();
}
