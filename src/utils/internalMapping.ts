import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";

/**
 * Преобразует массив университетов в строковое представление, пригодное для вывода и возвращает его
 * @param universities
 */
export function formatUniversities(universities: UniversityDto[]): string {
    return universities.map(university => {
        const chairName = university.chair_name || 'Неизвестно';
        const educationStatus = university.education_status || 'Неизвестно';
        const facultyName = university.faculty_name || 'Неизвестно';
        const name = university.name || 'Неизвестно';

        return `Программа: ${chairName}, Статус: ${educationStatus}, Факультет: ${facultyName}, Университет: ${name}\n`;
    }).join('\n');
}

/**
 * Преобразует массив карьер в строковое представление, пригодное для вывода и возвращает его
 * @param workExperiences
 */
export function formatWorkExperience(workExperiences: CareerDto[]): string {
    return workExperiences.map(work => {
        const company = work.company || 'Неизвестно';
        const position = work.position || 'Неизвестно';
        const startDate = work.from !== undefined ? work.from : 'Неизвестно';
        const endDate = work.until !== undefined ? work.until : 'н.в.';

        return `${company} - ${position} (${startDate} - ${endDate})`;
    }).join('\n');
}

export function createNewUniversity() : UniversityDto {
    return new UniversityDto();
}

export function createNewWorkExperience() : CareerDto {
    return new CareerDto();
}