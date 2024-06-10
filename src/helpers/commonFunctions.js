const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generatePosition = (arrayofPositions, height) => {
  let x, y;
  let isIntersecting;
  do {
    x = Math.random() * 70;
    y = Math.random() * height;

    isIntersecting = arrayofPositions.some((pos) => {
      const dx = pos[0] - x;
      const dy = pos[1] - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 15; // Расстояние между кружочками
    });
  } while (isIntersecting);
  arrayofPositions.push([x, y]);
  return [x, y];
};

export { randomIntFromInterval, generatePosition };
