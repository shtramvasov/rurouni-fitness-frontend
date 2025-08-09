export function sanitizeWeight(weight) {
  if (!weight && weight !== 0) return undefined; // Если пусто или не 0
  
  // Если weight уже число, преобразуем в строку
  if (typeof weight === 'number') weight = String(weight);

  let sanitizedValue = weight
    .replace(/,/g, '.')          // Заменяем запятые на точки
    .replace(/[^\d.]/g, '');     // Удаляем всё, кроме цифр и точек

  // Разделяем на целую и дробную части
  const [integerPart, decimalPart] = sanitizedValue.split('.');

  // Обрабатываем целую часть (макс 3 цифры)
  const cleanInteger = integerPart.slice(0, 3).replace(/^0+/, '') || '0';

  // Обрабатываем дробную часть (макс 2 цифры, убираем лишние нули)
  let cleanDecimal = '';
  if (decimalPart) {
    cleanDecimal = decimalPart
      .slice(0, 2)                // Берем не больше 2 цифр после точки
      .replace(/0+$/, '');        // Убираем trailing zeros (11.50 → 11.5)
  }

  // Собираем результат
  let result = cleanInteger;
  if (cleanDecimal) result += `.${cleanDecimal}`; // Добавляем дробную часть, если она есть

  // Если получилась пустая строка (например, из-за некорректного ввода), возвращаем undefined
  return result === '' ? undefined : result;
}