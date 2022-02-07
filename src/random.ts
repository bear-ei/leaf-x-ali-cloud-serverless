/**
 * Generate a random number of specified length.
 *
 * @param length Specify the length.
 */
export const generateRandom = (length: number) =>
  Math.floor(
    (Math.random() + Math.floor(Math.random() * 9 + 1)) *
      Math.pow(10, length - 1)
  );
