
import { AppSyncResolverEvent } from 'aws-lambda';
import { getUsers, main } from './handler';
import * as AWSMock from 'aws-sdk-mock';


const mockData = {
  Items: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ],
};

describe('getUsers', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  beforeEach(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params, callback) => {
      callback(null, mockData);
    });
  })

  it('should return a list of users', async () => {
    const result = await getUsers();
    expect(result).toEqual(mockData.Items);
    
  });
});

describe('main', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  beforeEach(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params, callback) => {
      callback(null, mockData);
    });
  })
  
  it('should call getUsers when operation is "Query" and fieldName is "getUsers"', async () => {
    const event = {
      arguments: {},
      info: { parentTypeName: 'Query', fieldName: 'getUsers' },
    } as AppSyncResolverEvent<{ [key: string]: string | number }> ;
    const result = await main(event);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should throw an error for unknown operation', async () => {
    const event = {
      arguments: {},
      info: { parentTypeName: 'Unknown', fieldName: 'Unknown' },
    } as AppSyncResolverEvent<{ [key: string]: string | number }>;
    try {
      await main(event);
    } catch (error) {
      expect(error.message).toBe('unknown operation');
    }
  });
});
