import {ConnectionType} from "../enums/ConnectionType.ts";
import {SpecialityDto} from "../api/internal/dto/SpecialityDto.ts";
import {JobAttendanceFormat} from "../enums/JobAttendanceFormat.ts";

export class CVDataValidator {

    public static MIN_BIRTH_DATE : Date = new Date(1900, 1, 0);
    public static MAX_SUMMARY_LENGTH = 1500;

    public static validateName(name: string): boolean {
        const nameRegex = /^\p{L}+([-']?\p{L}+)?$/u;
        return nameRegex.test(name.trim());
    }

    public static validateEmail(email: string): boolean {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email.trim());
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

}