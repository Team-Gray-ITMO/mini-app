import {FC, forwardRef, useEffect, useState} from 'react';
import {Avatar, Button, Div, Image, NavIdProps, Panel, Text,} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/personal_data.css';
import {parseDate} from "../utils/vkApiMapping.ts";
import {CV} from "../models/CV.ts";
import {UserResumeInfo} from "../models/UserResumeInfo.ts";
import {formatUniversities, formatWorkExperience} from "../utils/internalMapping.ts";
import {ConnectionType} from "../enums/ConnectionType.ts";
import Select from "react-select/base";
import {Multiselect} from "multiselect-react-dropdown";
import {ResumeApiClient} from "../api/internal/client/ResumeApiClient.ts";
import {SpecialityDto} from "../api/internal/dto/SpecialityDto.ts";

export interface ResumeProps extends NavIdProps {
    fetchedUser?: UserInfo;
    currentUser?: UserResumeInfo
}

export const PersonalData: FC<ResumeProps> = ({id, fetchedUser, currentUser}) => {
    const [userCV, setCV] = useState<CV>(null);
    const ExampleCustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <button className={className} onClick={onClick} ref={ref}>
                {value}
            </button>
        ),
    );

    const resumeApiClient : ResumeApiClient = new ResumeApiClient();

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

    const handleSubmit = async () => {
        if (!userCV) return;

        try {
            const response = await fetch('https://localhost:8080/resumes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCV),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.CV_PAGE);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const routeNavigator = useRouteNavigator();

    useEffect(() => {
        console.log("Got this user info in Resume.tsx: " + JSON.stringify(currentUser, null, 2));
        console.log(currentUser?.universities);
        console.log(currentUser?.workExperience)

        setCV(new CV(currentUser?.name, currentUser?.phone, currentUser?.email,
            ConnectionType.PHONE,
            [],
            [],
            parseDate(currentUser?.dateOfBirth),
            currentUser?.city,
            false,
            currentUser?.avatar,
            formatUniversities(currentUser?.universities),
            formatWorkExperience(currentUser?.workExperience)));

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

                        {userCV &&
                            <Div>

                                {/*
                                TODO: Maybe extract text block into separate component with resume props data and use this everywhere it needs
                                */}

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>ФИО</Text>
                                    <input name='snp'
                                        style={{color: '#494848', fontSize: '1.5em', margin: '10px 40px', borderRadius: '30px', padding: '10px',
                                            border: 'none',
                                        backgroundColor: '#fff', minWidth: '400px', textAlign: 'center'}} value={userCV.snp} readOnly={false}
                                    onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Телефон</Text>
                                    <input name='phone'
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
                                           }} value={userCV.phone}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Email</Text>
                                    <input name='email'
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
                                           }} value={userCV.email}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Предпочитаемый
                                        способ связи</Text>
                                    <Div>
                                        <label style={{
                                            color: '#494848',
                                            fontSize: '1.5em',
                                            margin: '10px 40px',
                                            borderRadius: '30px',
                                            padding: '10px',
                                            border: 'none',
                                            backgroundColor: '#fff',
                                            textAlign: 'center'
                                        }}>
                                            <input type="radio"
                                                   name='connection_type'
                                                   id="connection_phone"
                                                   value={ConnectionType.PHONE}
                                                   checked={userCV.preferredConnectionType == ConnectionType.PHONE}
                                                   onChange={handleConnectionTypeChange}
                                                   style={{
                                                       color: '#494848',
                                                       fontSize: '1.5em',
                                                       margin: '10px 40px',
                                                       borderRadius: '30px',
                                                       padding: '10px',
                                                       border: 'none',
                                                       backgroundColor: '#fff',
                                                       textAlign: 'center'
                                                   }}/>
                                            Телефон
                                        </label>
                                        <label style={{
                                            color: '#494848',
                                            fontSize: '1.5em',
                                            margin: '10px 40px',
                                            borderRadius: '30px',
                                            padding: '10px',
                                            border: 'none',
                                            backgroundColor: '#fff',
                                            textAlign: 'center'
                                        }}>
                                            <input type="radio"
                                                   name='connection_type'
                                                   id="connection_email"
                                                   value={ConnectionType.EMAIL}
                                                   checked={userCV.preferredConnectionType == ConnectionType.EMAIL}
                                                   onChange={handleConnectionTypeChange}
                                                   style={{
                                                       color: '#494848',
                                                       fontSize: '1.5em',
                                                       margin: '10px 40px',
                                                       borderRadius: '30px',
                                                       padding: '10px',
                                                       border: 'none',
                                                       backgroundColor: '#fff',
                                                       textAlign: 'center'
                                                   }}/>
                                            Email
                                        </label>
                                    </Div>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Предпочитаемая специальность</Text>
                                    <Multiselect
                                        id='preferredSpeciality'
                                        options={selectState.options}
                                        onSelect={onSpecialityChange}
                                        onRemove={onSpecialityChange}
                                        displayValue="name"
                                        placeholder='Выберите предпочитаемую специальность'
                                    />
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Формат работы</Text>
                                    <Multiselect
                                        id='preferredWorkFormat'
                                        options={workFormatsSelect.options}
                                        onSelect={onWorkFormatChange}
                                        onRemove={onWorkFormatChange}
                                        displayValue="name"
                                        placeholder='Выберите формат работы'
                                    />
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Дата
                                        рождения</Text>
                                    <DatePicker name='dateOfBirth' selected={userCV.dateOfBirth} onChange={(date) => {
                                        if (date != null) {
                                            userCV.dateOfBirth = date;
                                        }
                                    }}
                                                customInput={<ExampleCustomInput className='calendar-button'/>}
                                                showMonthYearDropdown={true}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Город
                                        проживания</Text>
                                    <input name='city'
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
                                           }} value={userCV.city}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 10px'}}>Готовность к
                                        переезду или командировкам</Text>
                                    <input
                                        type="checkbox"
                                        name='isReadyToMove'
                                        checked={userCV.isReadyToMove}
                                        onChange={onMoveChange}
                                    />
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: '1.5em',
                                        margin: '10px 40px'
                                    }}>Образование</Text>
                                    <input name='education'
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
                                           }} value={userCV.education}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Опыт
                                        работы</Text>
                                    <input name='workExperience'
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
                                           }} value={userCV.workExperience}
                                           onChange={handleChange}/>
                                </Div>
                            </Div>
                        }
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
                            onClick={() => {
                                routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.PATTERN);
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
