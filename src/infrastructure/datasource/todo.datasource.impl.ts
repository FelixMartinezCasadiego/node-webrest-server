import { prisma } from "../../data/postgres";
import { TodoDatasource } from "../../domain/datasources/todo.datasource";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";
import { CustomError } from "../../domain/erros/custom.error";

export class TodoDatasourceImpl implements TodoDatasource {
  async create(creteTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: creteTodoDto!,
    });

    return TodoEntity.fromObject(todo);
  }
  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();

    return todos.map((todo) => TodoEntity.fromObject(todo));
  }
  async findById(id: number): Promise<TodoEntity> {
    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo) throw new CustomError(`Todo with id ${id} not found`, 404);

    return TodoEntity.fromObject(todo);
  }
  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    await this.findById(updateTodoDto.id);

    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto!.values,
    });

    return TodoEntity.fromObject(updatedTodo);
  }
  async deleteById(id: number): Promise<TodoEntity> {
    await this.findById(id);

    const deleted = await prisma.todo.delete({ where: { id } });

    return TodoEntity.fromObject(deleted);
  }
}
