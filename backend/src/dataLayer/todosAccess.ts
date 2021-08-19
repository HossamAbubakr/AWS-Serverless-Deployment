import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const logger = createLogger('todos')
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX,
    private readonly attachmentsBucket = process.env.ATTACHMENTS_BUCKET,
    private readonly linkExpiration = process.env.BUCKET_URL_EXPIRATION,
    ) {
  }

  async getTodos(userID : string): Promise<TodoItem[]> {
    // Generate log
    logger.info(`Loading user ${userID} todos`)
    // Query the database for the user's todos
    const todoQuery = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :ID',
      ExpressionAttributeValues: {
          ':ID': userID
      },
      ScanIndexForward: false
  }).promise()
    // Generate log
  logger.info(`Loaded ${todoQuery.Items.length} todos from user : ${userID}`)
  // Return todos
  return todoQuery.Items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    // Generate log
    logger.info(`Creating the following todo : ${JSON.stringify(todo)}`)
    // Put the new todo in the database
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()
    // Generate log
    logger.info("Todo created successfully")
    // Return the new todo
    return todo
  }

  async deleteTodo(userID: string, todoID: string) {
    // Generate log
    logger.info(`User : ${userID} is deleting the todo with the following ID : ${todoID}`)
    // Delete a todo from the database
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userID,
        todoId: todoID
      }
    }).promise()
    // Generate log
    logger.info("Todo deleted successfully")
  }

  async updateTodo(todoID: string, userID: string, name: string, dueDate: string, done: boolean): Promise<void> {
    // Generate log
    logger.info(`User : ${userID} is updating the todo with the following ID : ${todoID}`)
    // Update a todo in the database
    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId : todoID,
          userId : userID
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': name,
          ':dueDate': dueDate,
          ':done': done
        }
      }).promise()
    // Generate log
    logger.info("Todo updated successfully")
  }

  async addAttachment(todoID : string,userID : string, imageID : string): Promise<string> {
    // Generate log
    logger.info(`User is adding an attachement to the todo with the following ID : ${todoID}`)
    // Get a signed link for the S3 bucket.
    const signedLink = s3.getSignedUrl('putObject', {
      Bucket: this.attachmentsBucket,
      Key: imageID,
      Expires: Number(this.linkExpiration),
    })
    // Create a link for the image
    const imageLink = `https://${this.attachmentsBucket}.s3.amazonaws.com/${imageID}`
    // Attach the link to the todo
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId : todoID,
        userId : userID
      },
      UpdateExpression: 'set attachmentUrl = :imageUrl',
      ExpressionAttributeValues: {
        ':imageUrl': imageLink
      }
    }).promise()
    // Generate log
    logger.info(`Todo updated with attachment successfully through link: ${signedLink}`)
    // Return the signed link
    return signedLink;
  }
}

// Can br used in tandom with Serverless-offline plugin totest the project locally
// Since I am pushing this to AWS I will comment it.
/*
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }
  return new XAWS.DynamoDB.DocumentClient()
}
*/
