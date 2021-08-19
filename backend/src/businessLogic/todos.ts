import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()


export async function getTodos(userID : string){
  return todosAccess.getTodos(userID)
}

export async function deleteTodo(todoID: string, userID: string){
  return todosAccess.deleteTodo(userID, todoID)
}

export async function createTodo( createTodoRequest: CreateTodoRequest, userID: string ): Promise<TodoItem> {
  const todoID = uuid.v4()
  return await todosAccess.createTodo({
    todoId: todoID,
    userId: userID,
    name: createTodoRequest.name,
    createdAt : new Date().toISOString(),
    done: false,
    dueDate : createTodoRequest.dueDate,
  })
}

export async function updateTodo( todoID: string, updateTodoRequest: UpdateTodoRequest, userID: string ): Promise<void> {
  const { name, dueDate, done } = updateTodoRequest;
  await todosAccess.updateTodo(todoID, userID, name, dueDate, done);
}

export async function addAttachment(todoID: string, userID: string){
  const imageID = uuid.v4()
  return todosAccess.addAttachment(todoID,userID,imageID);
}