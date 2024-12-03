import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";

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

/**
 * Преобразует массив объектов, представляющих университеты, в которых обучался пользователь, получаемый из VK API,
 * в массив объектов University и возвращает его
 * @param apiData массив объектов, представляющих университеты, в которых обучался пользователь
 */
export function mapUniversities(apiData: any[]): UniversityDto[] {
    return apiData.map(item => new UniversityDto(
        item.id,
        item.city,
        item.name,
        item.faculty,
        item.faculty_name,
        item.chair,
        item.chair_name,
        item.graduation,
        item.education_form,
        item.education_status
    ));
}

/**
 * Преобразует массив объектов, представляющих организации, в которых работал пользователь, получаемый из VK API,
 * в массив объектов CareerDto и возвращает его
 * @param apiData массив объектов, представляющих карьеру пользователя
 */
export function mapCareers(apiData: any[]): CareerDto[] {
    return apiData.map(item => new CareerDto(
        item.group_id,
        item.company,
        item.city_id,
        item.city_name,
        item.from,
        item.until,
        item.position
    ));
}