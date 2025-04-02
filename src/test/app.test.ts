import { envs } from "../config/envs";
import { Server } from "../presentation/server";

jest.mock("../presentation/server");

describe("Testing App.ts", () => {
  test("should call server with arguments and start", async () => {
    await import("../app");

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      public_path: envs.PUBLIC_PATH,
      routes: expect.any(Function),
    });

    expect(Server.prototype.start).toHaveBeenLastCalledWith();
  });
});
