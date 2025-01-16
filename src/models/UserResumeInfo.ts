import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";

export class UserResumeInfo {
    constructor(
        public surname: string,
        public userName: string,
        public name: string,
        public phone: string,
        public email: string,
        public dateOfBirth: string,
        public city: string,
        public avatar: string,
        public universities: UniversityDto[],
        public workExperience: CareerDto[],
    ) {
    }
}