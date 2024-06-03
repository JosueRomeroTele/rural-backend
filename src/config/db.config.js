import AWS from 'aws-sdk';
AWS.config.update({region:'us-east-1'})

var ddb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient()

const tableUser = 'users'
const tableDevice = 'devices'
const tableRol = 'rol'

export {docClient,ddb,tableUser,tableDevice,tableRol}