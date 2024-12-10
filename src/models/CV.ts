import {ConnectionType} from "../enums/ConnectionType.ts";
import {SpecialityDto} from "../api/internal/dto/SpecialityDto.ts";
import {WorkFormatDto} from "../api/internal/dto/WorkFormatDto.ts";
import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";

export class CV {
    constructor(
        public snp: string,
        public phone: string,
        public email: string,
        public preferredConnectionType: ConnectionType,
        public preferredSpecialities: SpecialityDto[],
        public preferredWorkFormats: WorkFormatDto[],
        public dateOfBirth: Date,
        public city: string,
        public isReadyToMove: boolean,
        public avatar: string,
        public education: UniversityDto[],
        public workExperience: CareerDto[]
    ) {
    }
}