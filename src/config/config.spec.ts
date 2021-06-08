describe("config", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should export object with correct keys", () => {
    const config = require("./config").config;

    expect(config).toMatchObject({
      postgres: {
        config: {
          domain: expect.any(String),
          user: expect.any(String),
          database: expect.any(String),
          password: expect.any(String),
          port: expect.any(Number),
        },
        pgadmin: {
          defaultEmail: expect.any(String),
          defaultPassword: expect.any(String),
          port: expect.any(Number),
        },
      },
      redis: {
        queue: {
          host: expect.any(String),
          port: expect.any(Number),
          password: expect.any(String),
        }
      }
    });
  });
});
