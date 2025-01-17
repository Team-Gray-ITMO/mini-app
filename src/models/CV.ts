import {ConnectionType} from "../enums/ConnectionType.ts";
import {SpecialityDto} from "../api/internal/dto/SpecialityDto.ts";
import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";
import {JobAttendanceFormat} from "../enums/JobAttendanceFormat.ts";


export class CV {
    constructor(
        public surname : string,
        public name : string,
        public patronymic : string,
        public snp: string,
        public phone: string,
        public email: string,
        public preferredConnectionType: ConnectionType,
        public preferredSpecialities: SpecialityDto[],
        public preferredJobAttendanceFormat : JobAttendanceFormat,
        public dateOfBirth: Date,
        public city: string,
        public isReadyForBusinessTrips: boolean,
        public isReadyForRelocation: boolean,
        public avatar: string,
        public avatarFile: File,
        public education: UniversityDto[],
        public workExperience: CareerDto[],
        public summary: string,
        public vkId: number,
        public title : string
    ) {
    }
}