import {Avatar, Button, Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import {CV} from "../models/CV.ts";
import {FC, useEffect, useState} from "react";
import {CVApiClient} from "../api/internal/client/CVApiClient.ts";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {createNewUniversity, createNewWorkExperience} from "../utils/internalMapping.ts";
import {
  ResumeCreateDto,
  ResumeUpdateDto,
  SaveDataClient,
  UserCreateDto
} from "../api/internal/client/SaveDataClient.ts";
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";
import {StorageKeyConstants} from "../storage/StorageKeyConstants.tsx";
import {EducationMapper} from "../api/internal/mapper/EducationMapper.ts";
import {JobMapper} from "../api/internal/mapper/JobMapper.ts";

export interface WorkProps extends NavIdProps {
    id: string;
}

export const WorkStage: FC<WorkProps> = ({id}) => {
    const saveDataClient = new SaveDataClient();
    const fetchDataClient = new FetchDataClient();
    const educationMapper = new EducationMapper();
    const jobMapper = new JobMapper();

    const params = useMetaParams<{cv: CV}>();
    const [userCV, setCV] = useState<CV>(params?.cv);


    console.log("Got cv in work stage: ", params?.cv);
    console.log('Set userCV in work after getting cv: ', userCV);

    const resumeApiClient : CVApiClient = new CVApiClient();

    const selectState = {
        options: resumeApiClient.getSpecialities()
    };

    const workFormatsSelect = {
        options: resumeApiClient.getWorkFormats()
    };

    const onMoveChange = (event) => {
        setCV({ ...userCV, isReadyToMove: event.target.checked });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCV({ ...userCV, [name]: value });
    };

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
        if (!userCV) return;
        const templateId = localStorage.getItem(StorageKeyConstants.TEMPLATE_ID)

        try {

            const savedResume = await saveDataClient.createResume(userCV.vkId, new ResumeCreateDto(userCV.summary));
            const resumeId = savedResume.id;
            await saveDataClient.updateResume(userCV.vkId, new ResumeUpdateDto(savedResume.id, savedResume.summary, parseInt(templateId!)));

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

                console.log(`Saved ${i + 1} education item: `, savedEducationItem);
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

                console.log(`Saved ${i + 1} work item: `, savedWorkItem);
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
    }, []);

    return (
        <Panel id={id}>
            <Div style={{width: '90%'}}>
                <Div>
                    <Image size={70} src='/logo.svg'/>
                </Div>

                <Div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
                    {userCV &&
                        <Div style={{display: "flex", gap: "50px", alignItems: "center", marginBottom: '50px'}}>
                            <Avatar size={150} src={userCV.avatar}/>
                        </Div>
                    }

                    <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px"}}>

                        {userCV.workExperience.map((item, index) => (
                            <Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Организация</Text>
                                    <input name='company'
                                           style={{color: '#494848', fontSize: '1.5em', margin: '10px 40px', borderRadius: '30px', padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff', minWidth: '400px', textAlign: 'center'}} value={item.company} readOnly={false}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           company: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Сайт организации</Text>
                                    <input name='site'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff',
                                               minWidth: '400px',
                                               textAlign: 'center'
                                           }}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           site: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Позиция</Text>
                                    <input name='position'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               border: 'none',
                                               padding: '10px',
                                               backgroundColor: '#fff',
                                               minWidth: '400px',
                                               textAlign: 'center'
                                           }} value={item.position}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           position: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Начало</Text>
                                    <input name='from'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff',
                                               minWidth: '400px',
                                               textAlign: 'center'
                                           }} value={item.from}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           from: parseInt(e.target.value, 10)
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Окончание</Text>
                                    <input name='until'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff',
                                               minWidth: '400px',
                                               textAlign: 'center'
                                           }} value={ item.until == null && item.from != null ? 'н.в.' : item.until}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           until: parseInt(e.target.value, 10)
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Город, в котором работал</Text>
                                    <input name='city_name'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff',
                                               minWidth: '400px',
                                               textAlign: 'center'
                                           }}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           city_name: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Обязанности</Text>
                                    <input name='requirements'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff',
                                               minWidth: '400px',
                                               textAlign: 'center'
                                           }}
                                           onChange={(e) => {
                                               const updatedWorkExp = userCV.workExperience.map((workItem, workIndex) => {
                                                   if (workIndex === index) {
                                                       return {
                                                           ...workItem,
                                                           requirements: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return workItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, workExperience: updatedWorkExp});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Button
                                        size='s'
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '15px',
                                            color: 'black',
                                            height: '80px',
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                            minWidth: '320px',
                                            margin: '0 auto'
                                        }}
                                        onClick={() => handleDeleteWork(index)}
                                    >
                                        <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Убрать место работы</Text>
                                    </Button>
                                </Div>

                                <hr/>

                            </Div>
                        ))}
                    </Div>

                    <Div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        margin: '30px 0',
                        gap: '50px'
                    }}>

                        <Button
                            size='l'
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '15px',
                                color: 'black',
                                height: '80px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                minWidth: '320px'
                            }}
                            onClick={handleAddWork}
                        >
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Добавить место работы</Text>
                        </Button>

                        <Button
                            size='l'
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '15px',
                                color: 'black',
                                height: '80px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                minWidth: '320px'
                            }}
                            onClick={() => {
                                routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.EDUCATION, {state: {cv: userCV}, keepSearchParams: true});
                            }}
                        >
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Вернуться</Text>
                        </Button>
                        <Button
                            size='l'
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '15px',
                                color: 'black',
                                height: '80px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                minWidth: '320px'
                            }}
                            onClick={handleSubmit}
                        >
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Создать резюме</Text>
                        </Button>
                    </Div>

                </Div>
            </Div>


        </Panel>
    );
};
