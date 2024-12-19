import {Avatar, Button, Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import {CV} from "../models/CV.ts";
import {FC, useEffect, useState} from "react";
import {CVApiClient} from "../api/internal/client/CVApiClient.ts";
import {ConnectionType} from "../enums/ConnectionType.ts";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {createNewUniversity} from "../utils/internalMapping.ts";

export interface EdProps extends NavIdProps {
    id: string;
}

export const EducationStage: FC<EdProps> = ({id}) => {
    const params = useMetaParams<{cv: CV}>();
    const [userCV, setCV] = useState<CV>(params?.cv);


    console.log("Got cv in education stage: ", params?.cv);
    console.log('Set userCV in education after getting cv: ', userCV);

    const resumeApiClient : CVApiClient = new CVApiClient();

    const selectState = {
        options: resumeApiClient.getSpecialities()
    };

    const workFormatsSelect = {
        options: resumeApiClient.getWorkFormats()
    };

    const onSpecialityChange = (selectedList, selectedItem) => {
        setCV({ ...userCV, preferredSpecialities: selectedList });
    };

    const onWorkFormatChange = (selectedList, selectedItem) => {
        setCV({ ...userCV, preferredWorkFormats: selectedList });
    };

    const onMoveChange = (event) => {
        setCV({ ...userCV, isReadyToMove: event.target.checked });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCV({ ...userCV, [name]: value });
    };

    const handleConnectionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConnectionType = event.target.value as ConnectionType;
        setCV({ ...userCV, preferredConnectionType: newConnectionType });
    };

    const handleAddEducation = () => {

        const updatedEducation = userCV.education;
        updatedEducation.push(createNewUniversity());

        setCV({...userCV, education: updatedEducation});
    };

    const handleDeleteEducation = (index : number) => {
        const updatedEducation = userCV.education;
        if (index >= 0 && index < updatedEducation.length) {
            updatedEducation.splice(index, 1);
        }

        setCV({...userCV, education: updatedEducation});
    };

    const handleSubmit = async () => {
        if (!userCV) return;

        routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.WORK, {state: {cv: userCV}, keepSearchParams: true});
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

                        {userCV.education.map((item, index) => (

                            <Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Наименование</Text>
                                    <input name='name'
                                           style={{color: '#494848', fontSize: '1.5em', margin: '10px 40px', borderRadius: '30px', padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff', minWidth: '400px', textAlign: 'center'}} value={item.name} readOnly={false}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           name: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Факультет</Text>
                                    <input name='faculty'
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
                                           }} value={item.faculty_name}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           faculty_name: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Направление (программа)</Text>
                                    <input name='chair'
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
                                           }} value={item.chair_name}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           chair_name: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Статус</Text>
                                    <input name='status'
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
                                           }} value={item.education_status}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           education_status: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Форма обучения</Text>
                                    <input name='education_form'
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
                                           }} value={item.education_form}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           education_form: e.target.value // обновляем только поле name
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Год начала обучения</Text>
                                    <input name='start'
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
                                           }} value={item.start}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           start: parseInt(e.target.value, 10)
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Год выпуска</Text>
                                    <input name='graduation'
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
                                           }} value={item.graduation}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           graduation: parseInt(e.target.value, 10)
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
                                           }}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Оценка</Text>
                                    <input name='grade'
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
                                           }} value={item.grade}
                                           onChange={(e) => {
                                               const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                   if (eduIndex === index) {
                                                       return {
                                                           ...eduItem,
                                                           grade: parseInt(e.target.value, 10)
                                                       };
                                                   }
                                                   return eduItem; // остальные элементы остаются без изменений
                                               });
                                               setCV({...userCV, education: updatedEducation});
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
                                        onClick={() => handleDeleteEducation(index)}
                                    >
                                        <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Убрать образовательное учреждение</Text>
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
                            onClick={handleAddEducation}
                        >
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Добавить место обучения</Text>
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
                                routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.CREATE);
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
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Перейти к следующему этапу</Text>
                        </Button>
                    </Div>

                </Div>
            </Div>


        </Panel>
    );
};
