/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const { config } = require("dotenv");

config({
  path: path.resolve(__dirname, "src/modules/cache/__tests__/.env"),
});

module.exports = {
  testTimeout: 10000,
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(tsx|ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "jest-transform-file",
    "^.+\\.svg$": "jest-svg-transformer",
    "\\.(css|less)$": "identity-obj-proxy",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@file-system/actions$": "<rootDir>/src/helpers/actions",
    "^@cryptoPackage/argon2$": "<rootDir>/src/helpers/Argon2",
    "^@helpers$": "<rootDir>/src/helpers",
    "^@core/config$": "<rootDir>/src/config/config",
    "^@core/cache$": "<rootDir>/src/modules/cache",
    "^@core/queue$": "<rootDir>/src/modules/queue",
  },
};
