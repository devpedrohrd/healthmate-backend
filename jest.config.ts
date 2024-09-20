module.exports = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Mapeia o alias 'src/*' para '<rootDir>/src/*'
  },
  // Outras configurações do Jest
  preset: 'ts-jest', // Certifique-se de que está usando ts-jest para compilar TypeScript
  testEnvironment: 'node',
}
