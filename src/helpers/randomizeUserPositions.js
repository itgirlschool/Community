// Функция для генерации случайного числа в заданном диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для хаотичного позиционирования пользователей
function randomizeUserPositions(screenWidth, screenHeight, userCount) {
  const users = [];
  const perGroup = 10; // Количество пользователей в каждой группе

  // Разделение пользователей на группы
  const groupCount = Math.ceil(userCount / perGroup);

  // Параметры пороговых значений (newThreshold) для разных групп пользователей
  const thresholds = [];
  for (let i = 0; i < groupCount; i++) {
    const newThreshold = {
      top: getRandomNumber(0, screenHeight - 100), // случайный верхний предел
      left: getRandomNumber(0, screenWidth - 100), // случайный левый предел
    };
    thresholds.push(newThreshold);
  }

  // Генерация позиций для каждого пользователя в зависимости от группы
  for (let i = 0; i < userCount; i++) {
    const groupIndex = Math.floor(i / perGroup); // Определение индекса группы для пользователя
    const threshold = thresholds[groupIndex]; // Использование соответствующего порогового значения

    // Генерация случайной позиции в пределах пороговых значений
    const userPosition = {
      top: getRandomNumber(threshold.top, threshold.top + 80),
      left: getRandomNumber(threshold.left, threshold.left + 80),
    };

    users.push(userPosition);
  }

  return users;
}

export default randomizeUserPositions;
