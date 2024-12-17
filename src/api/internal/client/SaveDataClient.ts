import axios from "axios";
import {CompanyDto, EducationDto, EducationInstitutionDto, JobDto, ResumeDto, UserDto} from "./FetchDataClient.ts";
import {ApiConstants} from "../constants/ApiConstants.ts";

export class CompanyCreateDto {
    constructor(
        public name : string
    ) { }
}

export class JobCreateDto {
    constructor(
        public resumeId: number,
        public companyId: number,
        public title: string,
        public location: string,
        public startDate: Date,
        public endDate: Date,
        public description: string
    ) { }
}

export class EducationCreateDto {
    constructor(
        public resumeId: number,
        public educationInstitutionId: number,
        public degreeType: string,
        public degreeName: string,
        public fieldOfStudy: string,
        public specialization: string,
        public startDate: Date,
        public endDate: Date,
        public grade: string,
    ) { }
}

export class EducationInstitutionCreateDto {
    constructor(
        public name : string
    ) { }
}

export class SkillCreateDto {
    constructor(
        public resumeId: number,
        public name: string,
        public proficiency: string
    ) {
    }
}

export class LanguageCreateDto {
    constructor(
        public resumeId: number,
        public name: string,
        public proficiency: string
    ) {
    }
}

export class UserCreateDto {
    constructor(
        public email: string,
        public vkId: string,
        public phoneNumber: string,
        public dateOfBirth: Date,
        public cityName: string
    ) {
    }
}

export class ResumeCreateDto {
    constructor(
        public userId: number,
        public summary: string,
    ) {
    }
}

export class SaveDataClient {
    
    public addCertification() {
        
        
        const url = "http://localhost:8080/api/v1/certification"
        axios({
            method: 'post',
            url: url,
            data: {
                
            }
            
        })
    }
    
    public addJob(job: JobCreateDto) {
        const url = "http://localhost:8080/api/v1/job"
        axios({
            method: 'post',
            url: url,
            data: {
                job
            }
        })
    }

    /**
     * Добавляет место работы
     * @param vkId
     * @param {EducationCreateDto} workPlace - данные для места работы
     * @returns {Promise<EducationDto>} - Данные созданного места работы или ошибка
     */
    public async addWorkPlace(vkId: number, workPlace: JobCreateDto) : Promise<JobDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.post<JobDto>(`${ApiConstants.JOB_BASE_URL}`, workPlace, {
                headers
            });
            return response.data; // Данные созданного пользователя
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при добавлении рабочего места'
            );
        }
    }

    /**
     * Добавляет компанию
     * @param vkId
     * @param {CompanyCreateDto} company - данные для компании
     * @returns {Promise<EducationDto>} - Данные созданной компании или ошибка
     */
    public async createCompany(vkId: number, company: CompanyCreateDto) : Promise<CompanyDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.post<CompanyDto>(`${ApiConstants.COMPANY_BASE_URL}`, company, {
                headers
            });
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании компании'
            );
        }
    }

    /**
     * Добавляет обр учреждение
     * @param vkId
     * @param {EducationInstitutionCreateDto} educationPlace - данные для учреждения
     * @returns {Promise<EducationDto>} - Данные созданного учреждения или ошибка
     */
    public async createEducationIntitution(vkId: number, educationPlace: EducationInstitutionCreateDto) : Promise<EducationInstitutionDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.post<EducationInstitutionDto>(`${ApiConstants.EDUCATION_INSTITUTION_BASE_URL}`, educationPlace, {
                headers
            });
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании образовательного учреждения'
            );
        }
    }

    /**
     * Добавляет образование пользователя
     * @param vkId
     * @param {EducationCreateDto} education - данные для образования
     * @returns {Promise<EducationDto>} - Данные созданного места образования или ошибка
     */
    public async addEducation(vkId: number, education: EducationCreateDto) : Promise<EducationDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.post<EducationDto>(`${ApiConstants.EDUCATION_BASE_URL}`, education, {
                headers
            });
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при добавлении образования'
            );
        }
    }
    
    public addSkill(skill: SkillCreateDto) {
        const url = "http://localhost:8080/api/v1/skill"
        axios({
            method: 'post',
            url: url,
            data: {
                skill
            }
        })
    }
    
    public addLanguage(language: LanguageCreateDto) {
        const url = "http://localhost:8080/api/v1/language"
        axios({
            method: 'post',
            url: url,
            data: {
                language
            }
        })
    }

    /**
     * Создает пользователя
     * @param {UserCreateDto} user - данные для создания пользователя
     * @returns {Promise<UserDto>} - Данные созданного пользователя или ошибка
     */
    public async createUser(vkId: number, user: UserCreateDto) : Promise<UserDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.post<UserDto>(`${ApiConstants.USER_BASE_URL}`, user, {
                headers
            });
            return response.data; // Данные созданного пользователя
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании пользователя'
            );
        }
    }

    /**
     * Создает резюме пользователя
     * @param {ResumeCreateDto} resume - данные для создания пользователя
     * @returns {Promise<ResumeDto>} - Данные созданного пользователя или ошибка
     */
    public async createResume(vkId: number, resume: ResumeCreateDto) : Promise<ResumeDto> {
        if (!resume) {
            throw new Error('Данные для создания резюме не переданы');
        }
        console.log('Перед отправкой:', resume);

        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.post<ResumeDto>(`${ApiConstants.RESUME_BASE_URL}`, resume, {
                headers
            });
            return response.data; // Данные созданного пользователя
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании резюме'
            );
        }
    }
}