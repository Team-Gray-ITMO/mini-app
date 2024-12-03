export class UniversityDto {
    constructor(
        public id: number,                      // идентификатор университета
        public city: string,                    // идентификатор города, в котором расположен университет
        public name: string,                    // наименование университета
        public faculty: number,                 // идентификатор факультета
        public faculty_name: string,            // наименование факультета
        public chair: number,                   // идентификатор кафедры
        public chair_name: string,              // наименование кафедры;
        public graduation: number,              // год окончания обучения
        public education_form: string,          // форма обучения
        public education_status: string,        // статус обучения (например, «Выпускник (специалист)»)
        ) {

    }
}