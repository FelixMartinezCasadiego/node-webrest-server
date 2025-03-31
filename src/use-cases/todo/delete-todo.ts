import { TodoEntity } from "../../domain/entities/todo.entity";
import { TodoRepository } from "../../domain/entities/todo.repository";

export interface DeleteTodoUseCase {
  execute(id: number): Promise<TodoEntity>;
}

export class UpdateTodo implements DeleteTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}
  execute(id: number): Promise<TodoEntity> {
    return this.repository.deleteById(id);
  }
}
