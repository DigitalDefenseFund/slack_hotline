const slash_commands = require('./slash_commands');

test('adds 1 to the argument', () => {
  expect(slash_commands(1)).toBe(2);
});