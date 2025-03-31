import { TodoEntity } from "../../domain/entities/todo.entity";
import { TodoRepository } from "../../domain/entities/todo.repository";

export interface GetTodosUseCase {
  execute(): Promise<TodoEntity[]>;
}

export class GetTodos implements GetTodosUseCase {
  constructor(private readonly repository: TodoRepository) {}
  execute(): Promise<TodoEntity[]> {
    return this.repository.getAll();
  }
}
