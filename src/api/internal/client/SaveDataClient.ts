import axios from "axios";


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
    
    public addEducation(education: EducationCreateDto) {
        const url = "http://localhost:8080/api/v1/job"
        axios({
            method: 'post',
            url: url,
            data: {
                education
            }
        })
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
    
    public createUser(user: UserCreateDto) {
        const url = "http://localhost:8080/api/v1/user"
        axios({
            method: 'post',
            url: url,
            data: {
                user
            }
        })
    }
}