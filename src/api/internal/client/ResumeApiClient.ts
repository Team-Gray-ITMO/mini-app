import {SpecialityDto} from "../dto/SpecialityDto.ts";
import {WorkFormatDto} from "../dto/WorkFormatDto.ts";

export class ResumeApiClient {

    public getSpecialities() : SpecialityDto[] {

        /** TODO: в API реализовать получение минимального списка специальностей:
         * ML;
         * DS;
         * QA;
         * ИБ;
         * Фронтенд разработка;
         * Бекенд разработка;
         * Мобильная разработка;
         * Администрирование;
         * Аналитика;
         * Маркетинг;
         * Прожект и продакт менеджмент;
         * PR и реклама;
         * UX/UI исследования;
         * Дизайн.
         */

        const result : SpecialityDto[] = [
            new SpecialityDto(1, 'ML'),
            new SpecialityDto(2, 'DS'),
            new SpecialityDto(3, 'QA'),
            new SpecialityDto(4, 'ИБ'),
            new SpecialityDto(5, 'Фронтенд разработка'),
            new SpecialityDto(6, 'Бекенд разработка'),

        ];
        return result;
    }

    public getWorkFormats() : WorkFormatDto[] {

        /**
         * TODO: в API реализовать получение минимального списка форматов работы (удаленный, комбинированный, офисный)
         */

        const result: WorkFormatDto[] = [
            new WorkFormatDto(1, 'Офисный'),
            new WorkFormatDto(2, 'Удаленный'),
            new WorkFormatDto(2, 'Комбинированный'),
        ];

        return result;
    }

}