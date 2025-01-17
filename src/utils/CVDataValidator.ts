import {ConnectionType} from "../enums/ConnectionType.ts";
import {SpecialityDto} from "../api/internal/dto/SpecialityDto.ts";
import {JobAttendanceFormat} from "../enums/JobAttendanceFormat.ts";
import {EducationForm} from "../enums/EducationForm.ts";
import {CV} from "../models/CV.ts";

export class CVDataValidator {

    public static MIN_BIRTH_DATE : Date = new Date(1900, 1, 0);
    public static MAX_SUMMARY_LENGTH = 1500;
    public static MAX_REQUIREMENTS_LENGTH = 1000;

    public static validateName(name: string): boolean {
        const nameRegex = /^\p{L}+([-']?\p{L}+)?$/u;
        return nameRegex.test(name.trim());
    }

    public static validateEmail(email: string): boolean {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email.trim());
    }

    public static validatePhone(phone: string): boolean {
        const cleanedPhone = phone.replace(/[\s\-\(\)\+]/g, '');
        const phoneRegex = /^\d{6,15}$/;

        return phoneRegex.test(cleanedPhone);
    }

    public static validatePreferredConnectionType(connectionType: ConnectionType): boolean {
        return connectionType != null;
    }

    public static validatePreferredSpecialities(specialities : SpecialityDto[]): boolean {
        return specialities != null && (specialities.length > 0);
    }

    public static validatePreferredJobAttendanceFormat(jobAttendanceFormat : JobAttendanceFormat): boolean {
        return jobAttendanceFormat != null;
    }

    public static validateDateOfBirth(bDate : Date): boolean {
        return bDate != null && bDate < new Date()  && bDate > CVDataValidator.MIN_BIRTH_DATE;
    }

    public static validateCity(city : string): boolean {
        return city != null && city.trim().length > 0;
    }

    public static validateAvatar(cv : CV) : boolean {
        return cv.avatar != null && cv.avatarContentType != null && cv.avatarContentType.startsWith('image/') && cv.avatarFile != null;
    }

    public static validateCommonText(text: string): boolean {
        return text != null && text.length > 0;
    }

    public static validateEducationForm(educationForm : string): boolean {
        return educationForm != null && (educationForm as EducationForm) != null;
    }

    public static validateEducationStartYear(educationStartDate : number): boolean {
        return educationStartDate != null && educationStartDate > 1900 && educationStartDate <= (new Date()).getFullYear();
    }

    public static validateEducationGraduationYear(educationGraduationDate : number, educationStartDate : number): boolean {
        return this.validateEducationStartYear(educationGraduationDate) && (educationGraduationDate >= educationStartDate);
    }

    public static validateEducationGrade(educationGrade : string): boolean {
        return educationGrade != null && educationGrade.length > 0;
    }

    public static validateWorkStartYear(workStartYear : number): boolean {
        return this.validateEducationStartYear(workStartYear);
    }

    public static validateWorkEndYear(workEndYear : number, workStartYear : number): boolean {
        return this.validateWorkStartYear(workEndYear) && (workEndYear >= workStartYear);
    }

    public static validateCVPersonalData(cv: CV) : boolean {
        return this.validateName(cv.surname) &&
            this.validateName(cv.name) &&
            this.validateEmail(cv.email) &&
            this.validatePhone(cv.phone) &&
            this.validateEmail(cv.email) &&
            this.validatePreferredConnectionType(cv.preferredConnectionType) &&
            this.validatePreferredSpecialities(cv.preferredSpecialities) &&
            this.validateDateOfBirth(cv.dateOfBirth) &&
            this.validatePreferredJobAttendanceFormat(cv.preferredJobAttendanceFormat) &&
            this.validateCity(cv.city) &&
            this.validateAvatar(cv) &&
            this.validateCommonText(cv.summary) &&
            this.validateCommonText(cv.title) &&
            cv.vkId != null
    }

    public static validateCVEducationData(cv : CV) : boolean {
        const educationItems = cv.education;

        let isValid: boolean = true;
        educationItems.forEach(educationItem => {
            isValid &&= this.validateCity(educationItem.city);
            isValid &&= this.validateCommonText(educationItem.name);
            isValid &&= this.validateCommonText(educationItem.faculty_name);
            isValid &&= this.validateCommonText(educationItem.chair_name);
            isValid &&= this.validateEducationStartYear(educationItem.start);
            isValid &&= this.validateEducationGraduationYear(educationItem.graduation, educationItem.start);
            isValid &&= this.validateCommonText(educationItem.education_form);
            isValid &&= this.validateCommonText(educationItem.education_status);

        });

        return isValid;
    }

    public static validateCVWorkData(cv : CV) : boolean {
        const workItems = cv.workExperience;

        let isValid: boolean = true;
        workItems.forEach(workItem => {
            isValid &&= this.validateCommonText(workItem.company);
            isValid &&= this.validateCommonText(workItem.site);
            isValid &&= this.validateCommonText(workItem.city_name);
            isValid &&= this.validateWorkStartYear(workItem.from);
            isValid &&= this.validateWorkEndYear(workItem.until, workItem.from);
            isValid &&= this.validateCommonText(workItem.position);
            isValid &&= this.validateCommonText(workItem.requirements);
            isValid &&= this.validatePreferredJobAttendanceFormat(workItem.attendanceFormat);



        })

        return isValid;
    }

}