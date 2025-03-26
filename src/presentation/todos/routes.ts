import { Router } from "express";
import { TodosController } from "./controllers";

export class TodosRoutes {
  static get routes(): Router {
    const router = Router();

    const todoController = new TodosController();

    router.get("/", todoController.getTodos);
    router.get("/:id", todoController.getTodoById);

    router.post("/", todoController.createTodo);
    router.put("/:id", todoController.updateTodo);

    return router;
  }
}
