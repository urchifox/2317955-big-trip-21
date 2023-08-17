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
  return Array.from(
    {length: getRandomInteger(maxCount)},
    () => `https://loremflickr.com/248/152?random=${getRandomInteger(100)}`
  );
}

function makeNonRepeatingIdGenerator(maxId) {
  const ids = [];
  return () => {
    let newId = getRandomInteger(maxId);

    if (ids.length >= maxId) {
      return null;
    }

    while (ids.includes(newId)) {
      newId = getRandomInteger(maxId);
    }

    ids.push(newId);
    return newId;
  };
}

export {
  getRandomArrayElement,
  getRandomInteger,
  getRandomPictures,
  makeNonRepeatingIdGenerator,
  makeNextArrayElementGenerator,
};
