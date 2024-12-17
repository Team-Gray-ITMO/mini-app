import {
    CompanyCreateDto,
    JobCreateDto
} from "../client/SaveDataClient.ts";
import {CareerDto} from "../../vk/dto/CareerDto.ts";

export class JobMapper {
    public careerDtoToCompanyCreateDto(src : CareerDto): CompanyCreateDto {
        return new CompanyCreateDto(src.company);
    }

    public careerDtoToJobCreateDto(src : CareerDto, companyId : number, resumeId : number): JobCreateDto {
        return new JobCreateDto(resumeId, companyId, src.position, src.city_name, new Date(src.from, 0, 1),
            new Date(src.until, 0, 1), src.requirements);
    }
}