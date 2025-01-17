import {EducationCreateDto, EducationInstitutionCreateDto} from "../client/SaveDataClient.ts";
import {UniversityDto} from "../../vk/dto/UniversityDto.ts";
import {EducationDegreeType} from "../client/FetchDataClient.ts";
import {EducationForm} from "../../../enums/EducationForm.ts";
import {EducationAttendanceFormat} from "../../../enums/EducationAttendanceFormat.ts";

export class EducationMapper {
    public universityDtoToEducationInsitutionCreateDto(src : UniversityDto): EducationInstitutionCreateDto {
        return new EducationInstitutionCreateDto(src.name);
    }

    public universityDtoToEducationCreateDto(src : UniversityDto, educationInstitutionId : number, resumeId : number): EducationCreateDto {
        return new EducationCreateDto(resumeId, educationInstitutionId, src.faculty_name, src.education_form as EducationForm, EducationAttendanceFormat.ON_SITE, EducationDegreeType.UNIVERSITY, src.education_status, src.faculty_name,
            src.chair_name, new Date(src.start, 0, 1, 0, 0, 0, 0), new Date(src.graduation, 0, 1, 0, 0, 0, 0), src.grade);
    }
}