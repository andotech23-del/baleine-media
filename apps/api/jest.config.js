export default {
  testEnvironment: "node",
  transform: {},
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["js", "json"],
  collectCoverageFrom: ["src/**/*.js"],
  setupFiles: ["dotenv/config"]
};
