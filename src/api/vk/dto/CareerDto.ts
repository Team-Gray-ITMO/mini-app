export class CareerDto {
    constructor(
        public group_id: number,                        // идентификатор сообщества (если доступно, иначе company)
        public company: string,                         // название компании (если доступно, иначе group_id)
        public city_id: number,                         // идентификатор города (если доступно, иначе city_name)
        public city_name: string,                       // название города (если доступно, иначе city_id)
        public from: number,                            // год начала работы
        public until: number,                           // год окончания работы
        public position: string                         // должность
    ) {

    }
}