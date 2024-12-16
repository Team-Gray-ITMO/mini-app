import axios from "axios";
import {ApiConstants} from "../constants/ApiConstants.ts";

export class UserDto {
    constructor(
        public id: number,
        public email: string,
        public vkId: string,
        public phoneNumber: string,
        public dateOfBirth: Date,
        public cityName: string
    ) {
    }
}

export class FetchDataClient {

    /**
     * Получить пользователя по VK ID
     * @param {number} vkId - Идентификатор VK
     * @returns {Promise<UserDto>} - Данные пользователя или ошибка
     */
    public async getUserByVkId(vkId : number) : Promise<UserDto> {
        try {
            const response = await axios.get<UserDto>(`${ApiConstants.USER_BASE_URL}/vk/${vkId}`);
            return response.data; // Данные пользователя
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Пользователь с указанным VK ID не найден');
            } else {
                throw new Error('Произошла ошибка при получении данных');
            }
        }
    }

}