# LambdaMysqlTest

## Testing MySQL RDS connectivity.
Used for testing VPC subnet and security group to RDS instance from a Lambda function.

Performs db connect to RDS host, runs simple 'SHOW TABLES' query, and closes the connection.

Updated to use Lambda node.js 4.3 callback
