const {
  arrayContainElement,
  generateRandomFromLength,
} = require('./helpers.js');

test('should return random number from 0 to value-1', () => {
  expect(generateRandomFromLength(5)).toBeGreaterThanOrEqual(0);
  expect(generateRandomFromLength(5)).toBeLessThan(5);
});

test('should return true if array contains element', () => {
  const array = [1, 2, 3, 4, 5];
  expect(arrayContainElement(array, 5)).toBeTruthy();
  expect(arrayContainElement(array, 6)).not.toBeTruthy();
  expect(arrayContainElement(array, 0)).not.toBeTruthy();
});
