module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true, // カバレッジ収集を有効化
  coverageDirectory: 'coverage',
  coverageProvider: 'v8', // または 'babel'
  // 必要に応じてカバレッジレポート形式などを設定
  // coverageReporters: ['json', 'lcov', 'text', 'clover'],
};