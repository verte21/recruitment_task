const arrayContainElement = (array, element) => {
  if (array.indexOf(element) > -1) return true;
  else return false;
};

const generateRandomFromLength = (length) => {
  return Math.floor(Math.random() * length);
};

module.exports = {
  arrayContainElement,
  generateRandomFromLength,
};
