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

export class ResumeUpdateDto {
  constructor(
    public id: number,
    public summary: string,
    public templateId: number
  ) {
  }
}

export class SaveDataClient {
    
    public addCertification() {
        
        
        const url = `${ApiConstants.BASE_URL}/api/v1/certification`
        axios({
            method: 'post',
            url: url,
            data: {
                
            }
            
        })
    }
    
    public addJob(job: JobCreateDto) {
        const url = `${ApiConstants.BASE_URL}/api/v1/job`
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
     * @param {EducationCreateDto} workPlace - данные для места работы
     * @returns {Promise<EducationDto>} - Данные созданного места работы или ошибка
     */
    public async addWorkPlace(workPlace: JobCreateDto) : Promise<JobDto> {
        try {
            const response = await axios.post<JobDto>(`${ApiConstants.JOB_BASE_URL}`, workPlace);
            return response.data; // Данные созданного пользователя
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при добавлении рабочего места'
            );
        }
    }

    /**
     * Добавляет компанию
     * @param {CompanyCreateDto} company - данные для компании
     * @returns {Promise<EducationDto>} - Данные созданной компании или ошибка
     */
    public async createCompany(company: CompanyCreateDto) : Promise<CompanyDto> {
        try {
            const response = await axios.post<CompanyDto>(`${ApiConstants.COMPANY_BASE_URL}`, company);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании компании'
            );
        }
    }

    /**
     * Добавляет обр учреждение
     * @param {EducationInstitutionCreateDto} educationPlace - данные для учреждения
     * @returns {Promise<EducationDto>} - Данные созданного учреждения или ошибка
     */
    public async createEducationIntitution(educationPlace: EducationInstitutionCreateDto) : Promise<EducationInstitutionDto> {
        try {
            const response = await axios.post<EducationInstitutionDto>(`${ApiConstants.EDUCATION_INSTITUTION_BASE_URL}`, educationPlace);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании образовательного учреждения'
            );
        }
    }

    /**
     * Добавляет образование пользователя
     * @param {EducationCreateDto} education - данные для образования
     * @returns {Promise<EducationDto>} - Данные созданного места образования или ошибка
     */
    public async addEducation(education: EducationCreateDto) : Promise<EducationDto> {
        try {
            const response = await axios.post<EducationDto>(`${ApiConstants.EDUCATION_BASE_URL}`, education);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при добавлении образования'
            );
        }
    }
    
    public addSkill(skill: SkillCreateDto) {
        const url = `${ApiConstants.BASE_URL}/api/v1/skill`
        axios({
            method: 'post',
            url: url,
            data: {
                skill
            }
        })
    }
    
    public addLanguage(language: LanguageCreateDto) {
        const url = `${ApiConstants.BASE_URL}/api/v1/language`
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
    public async createUser(user: UserCreateDto) : Promise<UserDto> {
        try {
            const response = await axios.post<UserDto>(`${ApiConstants.USER_BASE_URL}`, user);
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
    public async createResume(resume: ResumeCreateDto) : Promise<ResumeDto> {
        if (!resume) {
            throw new Error('Данные для создания резюме не переданы');
        }
        console.log('Перед отправкой:', resume);

        try {
            const response = await axios.post<ResumeDto>(`${ApiConstants.RESUME_BASE_URL}`, resume);
            return response.data; // Данные созданного пользователя
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Произошла ошибка при создании резюме'
            );
        }
    }

    public async updateResume(resume: ResumeUpdateDto) : Promise<ResumeDto> {
      if (!resume) {
        throw new Error('Данные для создания резюме не переданы');
      }
      console.log('Перед обновлением:', resume);

      try {
        const response = await axios.put<ResumeDto>(`${ApiConstants.RESUME_BASE_URL}`, resume);
        return response.data; // Данные созданного пользователя
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || 'Произошла ошибка при создании резюме'
        );
      }
    }
}