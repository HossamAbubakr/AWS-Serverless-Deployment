import 'source-map-support/register'
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoID = event.pathParameters.todoId
    const userID = getUserId(event)
    // Generate log
    logger.info(`User : ${userID} is attempting to delete todo with the following ID : ${todoID} `)
    // Invoke the async delete todo item
    await deleteTodo(todoID, userID)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "Successfully deleted"
    }
  } catch (error) {
    // Generate log
    logger.info(`The following error occured: ${error}`)
  }

}
