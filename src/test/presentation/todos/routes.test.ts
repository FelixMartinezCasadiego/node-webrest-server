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
});
