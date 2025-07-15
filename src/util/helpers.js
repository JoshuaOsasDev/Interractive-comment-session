export const getRandomId = () => {
  const date = Date.now();
  const random = Math.random() * 10000;
  return `${date}-${random}`;
};
