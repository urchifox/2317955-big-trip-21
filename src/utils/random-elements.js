function getRandomInteger(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
}

function getRandomArrayElement(items) {
  return items[getRandomInteger(items.length)];
}

function makeNextArrayElementGenerator(items) {
  let i = 0;
  return () => {
    const element = items[i];
    i++;
    return element;
  };
}

function getRandomPictures(maxCount) {
  const array = [];
  for(let i = 0; i < maxCount; i++) {
    array.push({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(100)}`,
      description: 'some picture description',
    });
  }

  return array;
}

function makeNonRepeatingIdGenerator(maxId) {
  const ids = [];
  return () => {
    let newId = getRandomInteger(maxId).toString();

    if (ids.length >= maxId) {
      return null;
    }

    while (ids.includes(newId)) {
      newId = getRandomInteger(maxId).toString();
    }

    ids.push(newId);
    return newId;
  };
}

function isEscapeKeydown(key) {
  return key === 'Escape';
}

export {
  getRandomArrayElement,
  getRandomInteger,
  getRandomPictures,
  makeNonRepeatingIdGenerator,
  makeNextArrayElementGenerator,
  isEscapeKeydown,
};
