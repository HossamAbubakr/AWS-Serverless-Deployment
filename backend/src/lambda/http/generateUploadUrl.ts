import 'source-map-support/register'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { addAttachment } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('generateURL')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoID = event.pathParameters.todoId
    const userID = getUserId(event)
    // Invoke the attach image to todo function with the todoID and the current user
    const url = await addAttachment(todoID, userID);
    // Generate log
    logger.info(`User : ${userID} is attempting to generate a download link to an add an attachment to the following todo : ${todoID} `)
    // Return the signed url
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl : url
      })
    }
  } catch (error) {
    // Generate log
    logger.info(`The following error occured: ${error}`)
  }

}
