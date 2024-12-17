import axios from "axios";
import {ApiConstants} from "../constants/ApiConstants.ts";
import * as repl from "node:repl";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

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

export class ResumeDto {
    constructor(
        public id: number,
        public createdAt: Date,
        public summary: string,
        public user: UserDto,
        public links: LinkDto[],
        public skills: SkillDto[],
        public jobs: JobDto[],
        public educations: EducationDto[],
        public languages: LanguageDto[],
        public certifications: CertificationDto[],
        public template: TemplateBaseDto
    ) {}
}

export class LinkDto {
    constructor(
        public id: number,
        public platformName: string,
        public profileUrl: string
    ) {}
}

export class SkillDto {
    constructor(
        public id: number,
        public name: string,
        public proficiency: SkillProficiency
    ) {}
}

export enum SkillProficiency {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT"
}

export class JobDto {
    constructor(
        public id: number,
        public title: string,
        public company: CompanyDto,
        public location: string,
        public startDate: Date,
        public endDate: Date | null,
        public description: string
    ) {}
}

export class CompanyDto {
    constructor(
        public id: number,
        public name: string
    ) {}
}

export class EducationDto {
    constructor(
        public id: number,
        public degreeType: EducationDegreeType,
        public degreeName: string,
        public fieldOfStudy: string,
        public specialization: string,
        public startDate: Date,
        public endDate: Date | null,
        public grade: string,
        public institution: EducationInstitutionDto
    ) {}
}

export enum EducationDegreeType {
    UNIVERSITY = "UNIVERSITY",
    COLLEGE = "COLLEGE",
    HIGH_SCHOOL = "HIGH_SCHOOL",
    ELEMENTARY_SCHOOL = "ELEMENTARY_SCHOOL",
    OTHER = "OTHER"
}

export class EducationInstitutionDto {
    constructor(
        public id: number,
        public name: string
    ) {}
}

export class LanguageDto {
    constructor(
        public id: number,
        public name: string,
        public proficiency: LanguageProficiency
    ) {}
}

export enum LanguageProficiency {
    A1 = "A1",
    A2 = "A2",
    B1 = "B1",
    B2 = "B2",
    C1 = "C1",
    C2 = "C2"
}

export class CertificationDto {
    constructor(
        public id: number,
        public name: string,
        public issuingOrganization: string,
        public issueDate: Date,
        public expirationDate: Date | null,
        public credentialUrl: string,
        public languageProficiency: LanguageProficiency | null
    ) {}
}

export class TemplateBaseDto {
    constructor(
        public id: number,
        public name: string,
    ) {}
}

export class FetchDataClient {

    /**
     * Получить пользователя по VK ID
     * @param {number} vkId - Идентификатор VK
     * @returns {Promise<UserDto>} - Данные пользователя или ошибка
     */
    public async getUserByVkId(vkId : number) : Promise<UserDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.get<UserDto>(`${ApiConstants.USER_BASE_URL}/vk/${vkId}`, {
                headers
            });
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