import 'source-map-support/register'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodo')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userID = getUserId(event)
    // Generate log
    logger.info(`User : ${userID} is attempting to load his todos`)
    // Invoke the async getTodos functions to load user's todos
    const todos = await getTodos(userID);
    // Return user's todos
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items: todos })
    }
  } catch (error) {
    // Generate log
    logger.info(`The following error occured: ${error}`)
  }
}
