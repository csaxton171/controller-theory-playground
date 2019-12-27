import { ConsoleLogger } from "../../src/logging";

describe("ConsoleLogger", () => {
  let spyConsoleInfo: jest.SpyInstance;
  beforeEach(() => {
    spyConsoleInfo = jest.spyOn(global.console, "log").mockImplementation();
  });
  afterEach(() => {
    spyConsoleInfo.mockRestore();
  });

  it("should support logging informational", () => {
    const expectedMessage = "some message";
    new ConsoleLogger().info(expectedMessage);

    expect(spyConsoleInfo).toHaveBeenCalledWith(expectedMessage);
  });
});
