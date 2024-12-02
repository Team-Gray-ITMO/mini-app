/**
 * Преобразует строку, представляющую некоторую дату, получаемую из VK API, в объект Date и возвращает его
 * @param dateString некоторая дата, получаемая из VK API, соответствует формату d.m.YYYY
 * Функция всегда возвращает дату, в случае если распарсить строку не получает, то возвращает текущую дату
 */
export function parseDate(dateString: string | undefined) : Date {
    const nowDate = new Date();

    if (dateString == null) {
        return nowDate;
    }

    const parts = dateString!.split('.');
    if (parts.length !== 3) {
        // Неверный формат
        return nowDate;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // месяц начинается с 0 в JS, из VK приходит в естественном виде
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return date;
}