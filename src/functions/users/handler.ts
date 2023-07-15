import { AppSyncResolverEvent } from 'aws-lambda'

import * as AWS from 'aws-sdk';

type User = {
  id:string;
  name:string
}

export async function getUsers(): Promise<User[]> {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: 'users',
    };

    const data = await dynamoDb.scan(params).promise();
    return data.Items as User[]
};

const operations: { [key: string]: { [key: string]: Function } } = {
  Query: { getUsers },

}

export async function main(event: AppSyncResolverEvent<{ [key: string]: string | number }>){
  const {
    arguments: args,
    info: { parentTypeName: typeName, fieldName },
  } = event
  const type = operations[typeName]
  if (type) {
    const operation = type[fieldName]
    if (operation) {
      return operation(args)
    }
  }
  throw new Error('unknown operation')
}

