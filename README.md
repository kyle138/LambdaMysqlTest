# LambdaMysqlTest

## Testing MySQL RDS connectivity.
Used for testing VPC subnet and security group connectivity to RDS instance from a Lambda function.

Performs db connect to RDS host, runs simple 'SHOW TABLES' query, and closes the connection.

Updated to use Lambda node.js 8.10 Runtime

## Lambda Environment Variables
The following environment variables must be configured in your Lambda function:
* mysql_host
* mysql_port
* mysql_user
* mysql_pass
* mysql_database
