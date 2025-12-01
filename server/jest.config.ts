import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: false,
  maxWorkers: 1,
  setupFilesAfterEnv: [],
  testTimeout: 30000
};

export default config;
