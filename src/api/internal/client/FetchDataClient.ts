import axios from "axios";
import {ApiConstants} from "../constants/ApiConstants.ts";
import {CVHistory} from "../../../panels/Home.tsx";

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

    /**
     * Получить резюме по ID
     * @param {number} vkId - Идентификатор VK
     * @param {number} resumeId - Идентификатор резюме
     * @returns {Promise<ResumeDto>} - Данные резюме или ошибка
     */
    public async getResumeById(vkId : number, resumeId : number) : Promise<ResumeDto> {
        try {
            const headers = {
                'X-Vk-Id': vkId,
                'X-Client-Id': ApiConstants.API_KEY,
            };

            const response = await axios.get<ResumeDto>(`${ApiConstants.RESUME_BASE_URL}/${resumeId}`, {
                headers
            });
            return response.data; // Данные пользователя
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Резюме с указанным ID не найдено');
            } else {
                throw new Error('Произошла ошибка при получении данных');
            }
        }
    }

    public async getTemplates(vkId : number) : Promise<TemplateBaseDto[]> {
      try {
        const headers = {
          'X-Vk-Id': vkId,
          'X-Client-Id': ApiConstants.API_KEY,
        };

        const response = await axios.get<TemplateBaseDto[]>(`${ApiConstants.TEMPLATE_BASE_URL}`, {
          headers
        });

        console.log(response);

        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error('Шаблон с указанным ID не найдено');
        } else {
          throw new Error('Произошла ошибка при получении данных');
        }
      }
    }

  public async getHistory(vkId : number) : Promise<CVHistory[]> {
    try {
      const headers = {
        'X-Vk-Id': vkId,
        'X-Client-Id': ApiConstants.API_KEY,
      };

      const response = await axios.get(`${ApiConstants.RESUME_BASE_URL}`, {
        headers
      });

      return response.data.map((item) => {
        console.log("CV item: ", item)
        return new CVHistory(item.id, item.summary, this.formatDate(item.createdAt))
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Истории не найдено');
      } else {
        throw new Error('Произошла ошибка при получении данных');
      }
    }
  }

  public async getResumeAsPdf(resumeId: number, vkId : number) : Promise<void> {
    const headers = {
      'X-Vk-Id': vkId,
      'X-Client-Id': ApiConstants.API_KEY,
    };

    const url = `${ApiConstants.RESUME_BASE_URL}/${resumeId}/pdf`
    axios.get(url, {
      headers: headers,
      responseType: 'blob'
    }).then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `resume_${resumeId}.pdf`;
      link.click();
    })
  }

  public async getResumeAsHtml(resumeId: number, vkId : number) : Promise<void> {
    const headers = {
      'X-Vk-Id': vkId,
      'X-Client-Id': ApiConstants.API_KEY,
    };

    const url = `${ApiConstants.RESUME_BASE_URL}/${resumeId}/html`
    axios.get(url, {
        headers
      }
    ).then((response) => {
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `resume_${resumeId}.html`;
      link.click();
    })
  }

  public async getResumeAsDocx(resumeId: number, vkId : number) : Promise<void> {
      const headers = {
        'X-Vk-Id': vkId,
        'X-Client-Id': ApiConstants.API_KEY,
      }

    const url = `${ApiConstants.RESUME_BASE_URL}/${resumeId}/docx`
    axios.get(url, {
      responseType: 'blob',
      headers: headers,
    }).then((response) => {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `resume_${resumeId}.docx`;
      link.click();
    })
  }

  private formatDate(inputDate: string) {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
}