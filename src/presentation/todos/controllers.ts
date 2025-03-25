import { Request, Response } from "express";

const todos = [
  { id: 1, text: "Buy milk", created: new Date() },
  { id: 2, text: "Buy bread", created: null },
  { id: 3, text: "Buy butter", created: new Date() },
];

export class TodosController {
  //* DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    //* convert id in number with +
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: `ID ${id} is not a number` });

    const todo = todos.find((todo) => todo.id === id);

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };
}
