import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getUsers } from './handler';
import * as AWSMock from 'aws-sdk-mock';

describe('getUsers', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should return a list of users', async () => {
    const mockData = {
      Items: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ],
    };

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params, callback) => {
      callback(null, mockData);
    });

    const result = await getUsers({} as APIGatewayProxyEvent , {} as Context);
   
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify(mockData.Items));
    
  });

  it('should return an error message when an error occurs', async () => {
    const errorMessage = 'Database error';

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params, callback) => {
      callback(new Error(errorMessage));
    });

    const result = await getUsers({} as APIGatewayProxyEvent , {} as Context);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(JSON.stringify({ message: 'Ocorreu um erro ao buscar os usuários.' }));
    
  });
});
