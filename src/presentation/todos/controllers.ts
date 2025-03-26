import { Request, Response } from "express";

let todos = [
  { id: 1, text: "Buy milk", completedAt: new Date() },
  { id: 2, text: "Buy bread", completedAt: null },
  { id: 3, text: "Buy butter", completedAt: new Date() },
];

export class TodosController {
  //* DI
  constructor() {}

  public getTodos = (_req: Request, res: Response) => {
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

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;

    if (typeof text !== "string")
      return res.status(400).json({ error: "Text property is required" });

    const newTodo = { id: todos.length + 1, text: text, completedAt: null };
    todos.push(newTodo);

    res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: `ID ${id} is not a number` });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json({ error: `Todo with id:${id} is not found` });

    const { text, completedAt } = req.body;

    //* Update for reference with mutability, no recommended
    todo.text = text || todo.text;
    completedAt === null
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    return res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: `ID ${id} is not a number` });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json({ error: `Todo with id:${id} is not found` });

    const updateTodos = todos.filter((todo) => todo.id !== id);
    if (updateTodos.length < 1)
      return res.status(404).json({ error: `No exists todos` });

    todos = updateTodos;
    return res.json(todo);
  };
}
