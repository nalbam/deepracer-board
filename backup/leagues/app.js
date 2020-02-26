/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the 'License'). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = 'deepracer-board-leagues';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = true; // TODO: update in case is required to use that definition
const partitionKeyName = 'league';
const partitionKeyType = 'S';
const sortKeyName = '';
const sortKeyType = '';
const hasSortKey = sortKeyName !== '';
const path = '/items';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
 * HTTP Get method for list objects *
 ************************************/

app.get(path, function (req, res) {
  // var condition = {}

  // condition['userId'] = {
  //   ComparisonOperator: 'EQ'
  // }

  // if (userIdPresent && req.apiGateway) {
  //   condition['userId']['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
  // }

  let userId = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;

  let queryParams = {
    TableName: tableName,
    FilterExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId
    },
  }

  console.log(`scan: ${JSON.stringify(queryParams)}`);
  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      console.log('scan: ' + err.message);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

app.get(path + '/all', function (req, res) {
  let queryParams = {
    TableName: tableName,
  }

  console.log(`scan-all: ${JSON.stringify(queryParams)}`);
  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      console.log('scan-all: ' + err.message);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};

  params[partitionKeyName] = req.params[partitionKeyName];
  try {
    params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Wrong column type ' + err });
  }

  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  // if (userIdPresent) {
  //   params['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // }

  let getItemParams = {
    TableName: tableName,
    Key: params,
  }

  console.log(`get: ${JSON.stringify(getItemParams)}`);
  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      console.log('get: ' + err.message);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    }
  });
});

/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function (req, res) {
  var params = {};
  try {
    params = {
      league: req.body.league,
    };
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Wrong column type ' + err });
  }

  // if (userIdPresent) {
  //   params['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // }

  let getItemParams = {
    TableName: tableName,
    Key: params,
  }

  let datetime = new Date().getTime();

  console.log(`get: ${JSON.stringify(getItemParams)}`);
  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      console.log('Could not load items: ' + err.message);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        // res.json(data.Item);  => update

        if (userIdPresent) {
          let userId = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
          if (data.Item.userId !== userId) {
            res.statusCode = 403;
            res.json({ error: 'Unauthorized.', url: req.url, body: req.body });
            return;
          }
        }

        let upateItemParams = {
          TableName: tableName,
          Key: params,
          UpdateExpression: 'SET title = :title, logo = :logo, dateOpen = :dateOpen, dateClose = :dateClose, dateTZ = :dateTZ, modified = :modified',
          ExpressionAttributeValues: {
            ':title': req.body.title,
            ':logo': req.body.logo,
            ':dateOpen': req.body.dateOpen,
            ':dateClose': req.body.dateClose,
            ':dateTZ': req.body.dateTZ,
            ':modified': datetime,
          },
        };

        console.log(`post-update: ${JSON.stringify(upateItemParams)}`);
        dynamodb.update(upateItemParams, (err, data) => {
          if (err) {
            console.log('post-update: ' + err.message);
            res.statusCode = 500;
            res.json({ error: err, url: req.url, body: req.body });
          } else {
            res.json({ success: 'post-update call succeed!', url: req.url, data: data })
          }
        });
      } else {
        // res.json(data);  => put
        let putItemParams = {
          TableName: tableName,
          Item: {
            league: req.body.league,
            title: req.body.title,
            logo: req.body.logo,
          },
        }

        if (req.body.dateOpen) {
          putItemParams.Item['dateOpen'] = req.body.dateOpen;
        }
        if (req.body.dateClose) {
          putItemParams.Item['dateClose'] = req.body.dateClose;
        }
        if (req.body.dateTZ) {
          putItemParams.Item['dateTZ'] = req.body.dateTZ;
        }

        if (userIdPresent) {
          putItemParams.Item['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
        }

        console.log(`post-put: ${JSON.stringify(putItemParams)}`);
        dynamodb.put(putItemParams, (err, data) => {
          if (err) {
            console.log('post-put: ' + err.message);
            res.statusCode = 500;
            res.json({ error: err, url: req.url, body: req.body });
          } else {
            res.json({ success: 'post-put call succeed!', url: req.url, data: data })
          }
        });
      }
    }
  });
});

/*************************************
* HTTP post method for insert object *
**************************************/

app.post(path, function (req, res) {
  var params = {};
  try {
    params = {
      league: req.body.league,
    };
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Wrong column type ' + err });
  }

  // if (userIdPresent) {
  //   params['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // }

  let getItemParams = {
    TableName: tableName,
    Key: params,
  }

  let datetime = new Date().getTime();

  console.log(`get: ${JSON.stringify(getItemParams)}`);
  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      console.log('Could not load items: ' + err.message);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        // res.json(data.Item);  => update

        if (userIdPresent) {
          let userId = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
          if (data.Item.userId !== userId) {
            res.statusCode = 403;
            res.json({ error: 'Unauthorized.', url: req.url, body: req.body });
            return;
          }
        }

        let updateEx = 'SET title = :title, logo = :logo, modified = :modified';
        let valuesEx = {
          ':title': req.body.title,
          ':logo': req.body.logo,
          ':modified': datetime,
        };

        if (req.body.dateOpen) {
          updateEx = `${updateEx}, dateOpen = :dateOpen`;
          valuesEx[':dateOpen'] = req.body.dateOpen;
        }
        if (req.body.dateClose) {
          updateEx = `${updateEx}, dateClose = :dateClose`;
          valuesEx[':dateClose'] = req.body.dateClose;
        }
        if (req.body.dateTZ) {
          updateEx = `${updateEx}, dateTZ = :dateTZ`;
          valuesEx[':dateTZ'] = req.body.dateTZ;
        }

        let upateItemParams = {
          TableName: tableName,
          Key: params,
          UpdateExpression: updateEx,
          ExpressionAttributeValues: valuesEx,
        };

        upateItemParams.ExpressionAttributeValues[':modified'] = datetime;

        console.log(`post-update: ${JSON.stringify(upateItemParams)}`);
        dynamodb.update(upateItemParams, (err, data) => {
          if (err) {
            console.log('post-update: ' + err.message);
            res.statusCode = 500;
            res.json({ error: err, url: req.url, body: req.body });
          } else {
            res.json({ success: 'post-update call succeed!', url: req.url, data: data })
          }
        });
      } else {
        // res.json(data);  => put
        let putItemParams = {
          TableName: tableName,
          Item: {
            league: req.body.league,
            title: req.body.title,
            logo: req.body.logo,
            registered: datetime,
          },
        }

        if (req.body.dateOpen) {
          putItemParams.Item['dateOpen'] = req.body.dateOpen;
        }
        if (req.body.dateClose) {
          putItemParams.Item['dateClose'] = req.body.dateClose;
        }
        if (req.body.dateTZ) {
          putItemParams.Item['dateTZ'] = req.body.dateTZ;
        }

        if (userIdPresent) {
          putItemParams.Item['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
        }

        console.log(`post-put: ${JSON.stringify(putItemParams)}`);
        dynamodb.put(putItemParams, (err, data) => {
          if (err) {
            console.log('post-put: ' + err.message);
            res.statusCode = 500;
            res.json({ error: err, url: req.url, body: req.body });
          } else {
            res.json({ success: 'post-put call succeed!', url: req.url, data: data })
          }
        });
      }
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params,
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});

app.listen(3000, function () {
  console.log('App started')
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
