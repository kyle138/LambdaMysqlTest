'use strict';

var mysql = require('mysql');

exports.handler = (event, context, callback) => {

  //Global variables
  var numTables;

  console.log('Loading Lambda Function');
  console.log('Received event: ', JSON.stringify(event, null, 2));   //DEBUG

  // Check if required Lambda environment variables are set
  if( process.env.mysql_host &&
      process.env.mysql_port &&
      process.env.mysql_user &&
      process.env.mysql_pass &&
      process.env.mysql_database)
  {
    // Create MySQL connection within handler to limit container scope leakage
    var connection = mysql.createConnection({
      host      : process.env.mysql_host,
      port      : process.env.mysql_port,
      user      : process.env.mysql_user,
      password  : process.env.mysql_pass,
      database  : process.env.mysql_database
    });
  } else {
    console.error("Missing required environment variable(s)");
    callback("Internal error",null);
  }

  // Connect to MySQL
  function connectDB(err, cb) {
    if(err) {
    console.error("connectDB error: "+err);
    } else {
      connection.connect(function(err) {
        if(err) {
          console.log("DB Connection error:: "+err);
          callback("DB Connection Error", null);
        } else {
          console.log("DB Connected.");
          cb(null, endDB);
        }
      });
    }
  }

  // Query the DB. 'SHOW TABLES' used simply to test connetivity.
  function queryDB(err, cb) {
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
          cb(null, rtnNumTables);
        }
      });
    }
  }

  // Close MySQL connection
  function endDB(err, cb) {
    if(err) {
      console.error("endDB error: "+err);
    } else {
      connection.end(function(err) {
        if(err) {
          console.log("DB connection.end failed:: "+err);
          callback("DB disconnection error", null);
        } else {
          console.log("DB Disconnected.");
          cb(null, numTables);
        }
      });
    }
  }

  // Return the number of tables found
  function rtnNumTables(err, num, cb) {
    if(err) {
      console.error("rtnNumTables error: "+err);
      callback("Table count error", null);
    } else {
      if(!num) {
        console.log("rtnNumTables: !num");
        callback(null,'0');
      } else {
        console.log("rtnNumTables: num: "+num);
        callback(null, num);
      }
    }
  }

  // Begin the chain
  connectDB(null, queryDB); // Uses mysql connection.connect and connect.end

}
