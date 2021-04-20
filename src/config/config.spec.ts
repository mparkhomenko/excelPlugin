describe("config", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should export object with correct keys", () => {
    const config = require("./config").config;

    expect(config).toMatchObject({
      queue: {
        port: expect.any(Number),
        domain: expect.any(String),
        username: expect.any(String),
        password: expect.any(String),
      },
      
    });
  });
});
