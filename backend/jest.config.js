export default {
  testEnvironment: "node",
  testMatch: ["**/src/_tests_/**/*.test.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
