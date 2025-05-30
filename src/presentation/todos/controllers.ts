import { Request, Response } from "express";

/* domain */
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";
import { TodoRepository } from "../../domain/entities/todo.repository";

/* use cases */
import { GetTodos } from "../../use-cases/todo/get-todos";
import { GetTodo } from "../../use-cases/todo/get-todo";
import { CreateTodo } from "../../use-cases/todo/create-todo";
import { UpdateTodo } from "../../use-cases/todo/update-todo";
import { DeleteTodo } from "../../use-cases/todo/delete-todo";
import { CustomError } from "../../domain/erros/custom.error";

export class TodosController {
  //* DI
  constructor(private readonly todoRepository: TodoRepository) {}

  private handleError = (response: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return response.status(error.statusCode).json({ error: error.message });
    }

    response.status(500).json({ error: "Internal server error" });
  };

  public getTodos = async (_req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => this.handleError(res, error));
  };

  public getTodoById = async (req: Request, res: Response) => {
    //* convert id in number with +
    const id = +req.params.id;

    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => res.status(201).json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

    if (error) return res.status(400).json({ error });

    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then((updatedTodoDto) => res.json(updatedTodoDto))
      .catch((error) => this.handleError(res, error));
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };
}
