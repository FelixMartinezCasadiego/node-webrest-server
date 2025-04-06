import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../data/postgres";

describe("routes.ts", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(async () => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: "Hola Mundo 1" };
  const todo2 = { text: "Hola mMndo 2" };

  test("should return TODOs /api/todos", async () => {
    await prisma.todo.createMany({ data: [todo1, todo2] });

    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeNull();
  });

  test("should return a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo1.text,
      completedAt: null,
    });
  });

  test("should return a 404 notFound api/todos/:id", async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test("should return a new Todo api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test("should return a error if text is not valid api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({})
      .expect(400);

    expect(body).toEqual({ error: expect.any(String) });
  });

  test("should return a update TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: "Hola Mundo update", completedAt: "2024-10-21" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: "Hola Mundo update",
      completedAt: expect.any(String),
    });
  });

  test("should return 404 if TODO not found", async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ completedAt: "2024-10-21" })
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test("should return an updated TODO only the date shoul be updated", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: "2024-10-21" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: "Hola Mundo 1",
      completedAt: "2024-10-21T00:00:00.000Z",
    });
  });

  test("should delete a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: null,
    });
  });

  test("should return 404 if todo do not exist api/todos/:id", async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });
});
