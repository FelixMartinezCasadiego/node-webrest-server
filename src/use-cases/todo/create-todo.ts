import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";
import { TodoRepository } from "../../domain/entities/todo.repository";

export interface CreateTodoUseCase {
  execute(dto: CreateTodoDto): Promise<TodoEntity>;
}

export class CreateTodo implements CreateTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}
  execute(dto: CreateTodoDto): Promise<TodoEntity> {
    return this.repository.create(dto);
  }
}
