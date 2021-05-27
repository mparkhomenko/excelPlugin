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
          certificate: expect.any(String),
        },
        pgadmin: {
          defaultEmail: expect.any(String),
          defaultPassword: expect.any(String),
          port: expect.any(Number),
        },
      },
    });
  });
});
