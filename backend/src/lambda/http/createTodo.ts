import 'source-map-support/register'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userID = getUserId(event)
    // Generate log
    logger.info(`User : ${userID} is attempting to create a todo`)
    // Invoke the async create todo function with the todo from the request and the current user
    const todoItem = await createTodo(newTodo, userID)
    // Return the newly created Todo
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item : todoItem
      })
    }
  } catch (error) {
    // Generate log
    logger.info(`The following error occured: ${error}`)
  }

}
