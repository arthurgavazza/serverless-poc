
import { middyfy } from '@libs/lambda';

// const getUsers: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
//     event,
//   });
// };

import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getUsers: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const params = {
      TableName: 'users',
    };

    const data = await dynamoDb.scan(params).promise();

    return  {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro ao buscar os usuários.' }),
    };
  }
};


export const main = middyfy(getUsers);
