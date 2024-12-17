import {EducationCreateDto, EducationInstitutionCreateDto} from "../client/SaveDataClient.ts";
import {UniversityDto} from "../../vk/dto/UniversityDto.ts";
import {EducationDegreeType} from "../client/FetchDataClient.ts";

export class EducationMapper {
    public universityDtoToEducationInsitutionCreateDto(src : UniversityDto): EducationInstitutionCreateDto {
        return new EducationInstitutionCreateDto(src.name);
    }

    public universityDtoToEducationCreateDto(src : UniversityDto, educationInstitutionId : number, resumeId : number): EducationCreateDto {
        return new EducationCreateDto(resumeId, educationInstitutionId, EducationDegreeType.UNIVERSITY, src.education_status, '-',
            src.chair_name, new Date('2015-01-01'), new Date(src.graduation, 0, 1, 0, 0, 0, 0), '-');
    }
}