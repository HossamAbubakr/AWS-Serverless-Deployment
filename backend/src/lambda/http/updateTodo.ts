import 'source-map-support/register'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoID = event.pathParameters.todoId
    const userID = getUserId(event)
    // Generate log
    logger.info(`User : ${userID} is attempting to update the follwoing todo : ${todoID}`)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // Invoke the async update todo function with the information from the request, the todo ID and the current user
    await updateTodo(todoID, updatedTodo, userID)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "Success"
    }
  } catch (error) {
    logger.info(`The following error occured: ${error}`)
  }

}
