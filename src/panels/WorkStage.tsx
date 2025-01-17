import {
    Button, Card,
    Div, Flex, FormItem,
    Image, Input,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack, Select,
    Textarea,
    usePlatform
} from "@vkontakte/vkui";
import {CV} from "../models/CV.ts";
import React, {FC, useEffect, useState} from "react";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {createNewWorkExperience} from "../utils/internalMapping.ts";
import {
    FileDto,
    ResumeCreateDto,
    ResumeUpdateDto,
    SaveDataClient
} from "../api/internal/client/SaveDataClient.ts";
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";
import {EducationMapper} from "../api/internal/mapper/EducationMapper.ts";
import {JobMapper} from "../api/internal/mapper/JobMapper.ts";
import {CVDataValidator} from "../utils/CVDataValidator.ts";
import {extractFileNameAndExtension} from "../utils/vkApiMapping.ts";
import {StorageKeyConstants} from "../storage/StorageKeyConstants.tsx";

export interface WorkProps extends NavIdProps {
    id: string;
}

export const WorkStage: FC<WorkProps> = ({id}) => {
    const saveDataClient = new SaveDataClient();
    new FetchDataClient();
    const educationMapper = new EducationMapper();
    const jobMapper = new JobMapper();

    const params = useMetaParams<{cv: CV}>();
    const [userCV, setCV] = useState<CV>(params?.cv);
    const platform = usePlatform();


    console.log("Got cv in work stage: ", params?.cv);
    console.log('Set userCV in work after getting cv: ', userCV);

    const handleAddWork = () => {

        const updatedWorkExperience = userCV.workExperience;
        updatedWorkExperience.push(createNewWorkExperience());

        setCV({...userCV, workExperience: updatedWorkExperience});
    };

    const handleDeleteWork = (index : number) => {
        const updatedWorkExperience = userCV.workExperience;
        if (index >= 0 && index < updatedWorkExperience.length) {
            updatedWorkExperience.splice(index, 1);
        }

        setCV({...userCV, workExperience: updatedWorkExperience});
    };

    const handleSubmit = async () => {
        if (!userCV || !CVDataValidator.validateCVWorkData(userCV)) return;
        const templateId = localStorage.getItem(StorageKeyConstants.TEMPLATE_ID)

        try {

            const savedResume = await saveDataClient.createResume(userCV.vkId, new ResumeCreateDto(userCV.title, userCV.summary));
            const resumeId = savedResume.id;
            await saveDataClient.updateResume(
                userCV.vkId,
                new ResumeUpdateDto(
                    savedResume.id,
                    savedResume.summary,
                    parseInt(templateId!),
                    userCV.title,
                    userCV.preferredJobAttendanceFormat,
                    userCV.preferredSpecialities.map(item => item.name),
                    userCV.isReadyForBusinessTrips,
                    userCV.isReadyForRelocation,
                    new FileDto(extractFileNameAndExtension(userCV.avatar), userCV.avatarContentType, userCV.avatarFile)
                )
            );

            for (let i = 0; i < userCV.education.length; i++) {
                const educationItem=  userCV.education[i];
                const educationInstitution = await saveDataClient.createEducationIntitution(
                    userCV.vkId,
                    educationMapper.universityDtoToEducationInsitutionCreateDto(educationItem)
                );
                const savedEducationItem = await saveDataClient.addEducation(
                    userCV.vkId,
                    educationMapper.universityDtoToEducationCreateDto(educationItem, educationInstitution.id, resumeId)
                );

                console.debug(`Saved ${i + 1} education item: `, savedEducationItem);
            }

            for (let i = 0; i < userCV.workExperience.length; i++) {
                const workItem = userCV.workExperience[i];
                const company = await saveDataClient.createCompany(
                    userCV.vkId,
                    jobMapper.careerDtoToCompanyCreateDto(workItem)
                );
                const savedWorkItem = await saveDataClient.addWorkPlace(
                    userCV.vkId,
                    jobMapper.careerDtoToJobCreateDto(workItem, company.id, resumeId)
                );

                console.debug(`Saved ${i + 1} work item: `, savedWorkItem);
            }

            await routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.CV_PAGE, {id: String(resumeId)}, {state: {cv: userCV}, keepSearchParams: true});

        } catch (error: any) {
            console.error('Ошибка при создании резюме:', error.message);
            return;
        }
    };

    const routeNavigator = useRouteNavigator();

    useEffect(() => {

        // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
        document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
        document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');
        document.documentElement.style.setProperty('--vkui_internal--panel_header_height', '60px');
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader
                before={
                    <Flex style={{ marginLeft: "10px" }} gap={10} justify='center'>
                        <Image size={40} noBorder={true}
                               src='/logo.svg'/>
                        <PanelHeaderBack
                            onClick={() => {
                                routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.EDUCATION, {state: {cv: userCV}, keepSearchParams: true});
                            }}
                            label={platform === 'vkcom' ? 'Назад' : undefined}
                        />
                    </Flex>
                }
                style={{textAlign: 'center'}}
            >Данные о месте работы (шаг № 3 / 3)</PanelHeader>
            <Div style={{width: '90%'}}>
                <Div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>

                    <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", minWidth: '100%'}}>

                        <Card style={{minWidth: '90%'}}>
                            <form onSubmit={(e) => e.preventDefault()}>
                                {userCV.workExperience.map((item, index) => (
                                    <Div key={index}>

                                        <FormItem
                                            htmlFor="company"
                                            top="Организация"
                                            status={CVDataValidator.validateCommonText(item.company) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateCommonText(item.company) ? '' : 'Введите наименование организации'}
                                            required
                                        >
                                            <Input id="company" name='company' value={item.company} onChange={e => {
                                                const updatedJobs = userCV.workExperience.map((eduItem, eduIndex) => {
                                                    if (eduIndex === index) {
                                                        return {
                                                            ...eduItem,
                                                            company: e.target.value
                                                        };
                                                    }
                                                    return eduItem;
                                                });
                                                setCV({...userCV, workExperience: updatedJobs});
                                            }}/>
                                        </FormItem>

                                        <FormItem
                                            htmlFor="site"
                                            top="Сайт организации"
                                            status={CVDataValidator.validateCommonText(item.site) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateCommonText(item.site) ? '' : 'Введите сайт организации'}
                                            required
                                        >
                                            <Input id="site" name='site' value={item.site} onChange={e => {
                                                const updatedJobs = userCV.workExperience.map((eduItem, eduIndex) => {
                                                    if (eduIndex === index) {
                                                        return {
                                                            ...eduItem,
                                                            site: e.target.value
                                                        };
                                                    }
                                                    return eduItem;
                                                });
                                                setCV({...userCV, workExperience: updatedJobs});
                                            }}/>
                                        </FormItem>

                                        <FormItem
                                            htmlFor="position"
                                            top="Позиция"
                                            status={CVDataValidator.validateCommonText(item.site) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateCommonText(item.site) ? '' : 'Введите позицию в компании'}
                                            required
                                        >
                                            <Input id="position" name='position' value={item.position} onChange={e => {
                                                const updatedJobs = userCV.workExperience.map((eduItem, eduIndex) => {
                                                    if (eduIndex === index) {
                                                        return {
                                                            ...eduItem,
                                                            position: e.target.value
                                                        };
                                                    }
                                                    return eduItem;
                                                });
                                                setCV({...userCV, workExperience: updatedJobs});
                                            }}/>
                                        </FormItem>

                                        <FormItem
                                            htmlFor="from"
                                            top="Год начала работы"
                                            status={CVDataValidator.validateEducationStartYear(item.from) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateEducationStartYear(item.from) ? '' : 'Пожалуйста, введите правильный год начала работы'}
                                            required
                                        >
                                            <Input id="from" name='from' value={item.from} onChange={e => {
                                                const updatedJobs = userCV.workExperience.map((eduItem, eduIndex) => {
                                                    if (eduIndex === index) {
                                                        return {
                                                            ...eduItem,
                                                            from: e.target.value
                                                        };
                                                    }
                                                    return eduItem;
                                                });
                                                setCV({...userCV, workExperience: updatedJobs});
                                            }}/>
                                        </FormItem>

                                        <FormItem
                                            htmlFor="until"
                                            top="Год окончания работы"
                                            status={CVDataValidator.validateWorkEndYear(item.until, item.from) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateWorkEndYear(item.until, item.from) ? '' : 'Пожалуйста, введите правильный год окончания работы'}
                                            required
                                        >
                                            <Input id="until" name='until' value={item.until} onChange={e => {
                                                const updatedJobs = userCV.workExperience.map((eduItem, eduIndex) => {
                                                    if (eduIndex === index) {
                                                        return {
                                                            ...eduItem,
                                                            until: e.target.value
                                                        };
                                                    }
                                                    return eduItem;
                                                });
                                                setCV({...userCV, workExperience: updatedJobs});
                                            }}/>
                                        </FormItem>

                                        <FormItem
                                            htmlFor="city-name"
                                            top="Город, в котором работал(-а)"
                                            status={CVDataValidator.validateCommonText(item.city_name) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateCommonText(item.city_name) ? '' : 'Введите название города'}
                                            required
                                        >
                                            <Input id="city-name" name='city-name' value={item.city_name} onChange={e => {
                                                const updatedJobs = userCV.workExperience.map((eduItem, eduIndex) => {
                                                    if (eduIndex === index) {
                                                        return {
                                                            ...eduItem,
                                                            city_name: e.target.value
                                                        };
                                                    }
                                                    return eduItem;
                                                });
                                                setCV({...userCV, workExperience: updatedJobs});
                                            }}/>
                                        </FormItem>

                                        <FormItem
                                            top="Формат работы"
                                            htmlFor="work-format"
                                            status={CVDataValidator.validateEducationForm(item.attendanceFormat) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateEducationForm(item.attendanceFormat) ? '' : 'Пожалуйста, укажите формат работы'}
                                            required
                                        >
                                            <Select
                                                id="work-format"
                                                placeholder="Выберите формат работы"
                                                onChange={e => {
                                                    const updatedWork = userCV.workExperience.map((workItem, workIndex) => {
                                                        if (workIndex === index) {
                                                            return {
                                                                ...workItem,
                                                                attendanceFormat: e.target.value
                                                            };
                                                        }
                                                        return workItem;
                                                    });
                                                    setCV({...userCV, workExperience: updatedWork});
                                                }}
                                                value={item.attendanceFormat}
                                                options={[
                                                    {
                                                        value: 'ON_SITE',
                                                        label: 'В офисе',
                                                    },
                                                    {
                                                        value: 'HYBRID',
                                                        label: 'Гибрид',
                                                    },
                                                    {
                                                        value: 'REMOTE',
                                                        label: 'Удалённый',
                                                    },
                                                ]}
                                            />
                                        </FormItem>

                                        <FormItem
                                            top={
                                                <FormItem.Top>
                                                    <FormItem.TopLabel htmlFor="summary">Обязанности</FormItem.TopLabel>
                                                    <FormItem.TopAside>{item.requirements.length}/{CVDataValidator.MAX_REQUIREMENTS_LENGTH}</FormItem.TopAside>
                                                </FormItem.Top>
                                            }
                                            required
                                            status={CVDataValidator.validateCommonText(item.requirements) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateCommonText(item.requirements) ? '' : 'Пожалуйста, заполните информацию об обязанностях на рабочем метсе'}
                                        >
                                            <Textarea
                                                id="summary"
                                                name="summary"
                                                maxLength={CVDataValidator.MAX_REQUIREMENTS_LENGTH}
                                                value={item.requirements}
                                                onChange={(e) => {
                                                    const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                        if (workIndex === index) {
                                                            return {
                                                                ...workItem,
                                                                requirements: e.target.value
                                                            };
                                                        }
                                                        return workItem;
                                                    });
                                                    setCV({...userCV, workExperience: updatedWorkExp});}
                                                }
                                                placeholder="Какие задачи выполняли, что делали, чего достигли..."
                                            />
                                        </FormItem>

                                        <FormItem>
                                            <Button
                                                type="button"
                                                size="l"
                                                stretched
                                                onClick={_ => {
                                                    handleDeleteWork(index)
                                                }}
                                            >
                                                Убрать место работы
                                            </Button>
                                        </FormItem>

                                        <hr/>

                                    </Div>
                                ))}

                                <FormItem>
                                    <Button
                                        type="button"
                                        size="l"
                                        stretched
                                        onClick={_ => {
                                            handleAddWork()
                                        }}
                                    >
                                        Добавить место работы
                                    </Button>
                                </FormItem>

                                <FormItem>
                                    <Button
                                        type="submit"
                                        size="l"
                                        stretched
                                        onClick={_ => {
                                            handleSubmit()
                                        }}
                                    >
                                        Создать резюме
                                    </Button>
                                </FormItem>

                            </form>
                        </Card>
                    </Div>

                </Div>
            </Div>


        </Panel>
    );
};
