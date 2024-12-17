import {FC, forwardRef, useEffect, useState} from 'react';
import {Avatar, Button, Div, Image, NavIdProps, Panel, Text,} from '@vkontakte/vkui';
import vkBridge, {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/personal_data.css';
import {parseDate} from "../utils/vkApiMapping.ts";
import {CV} from "../models/CV.ts";
import {UserResumeInfo} from "../models/UserResumeInfo.ts";
import {ConnectionType} from "../enums/ConnectionType.ts";
import {Multiselect} from "multiselect-react-dropdown";
import {CVApiClient} from "../api/internal/client/CVApiClient.ts";
import {SaveDataClient, UserCreateDto} from "../api/internal/client/SaveDataClient.ts";
import {FetchDataClient, UserDto} from "../api/internal/client/FetchDataClient.ts";
import {StorageKeyConstants} from "../storage/StorageKeyConstants.tsx";
import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";

export interface ResumeProps extends NavIdProps {
    fetchedUser?: UserInfo;
    currentUser?: UserResumeInfo
    currentUserCV?: CV
}

export const PersonalData: FC<ResumeProps> = ({id, fetchedUser, currentUser, currentUserCV}) => {
    const saveDataClient = new SaveDataClient();
    const fetchDataClient = new FetchDataClient();
    
    const [userCV, setCV] = useState<CV>(null);
    const ExampleCustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <button className={className} onClick={onClick} ref={ref}>
                {value}
            </button>
        ),
    );

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

    const addTestData = ()=> {
        fetchedUser = {
            bdate: "",
            city: {id: 0, title: ""},
            country: {id: 0, title: ""},
            first_name: "",
            last_name: "",
            photo_100: "",
            photo_200: "",
            photo_max_orig: "",
            sex: undefined,
            timezone: 0,
            id: 1
        };

        currentUser = new UserResumeInfo('Владимир Лиджигоряев', '+743434', 'email@mail.ru', '2024-06-01', 'SPB', 'avatar',
            [
                new UniversityDto(1, 'SPB', 'ITMO', 1, 'IPKN', 1, 'DWS', 2026, 'Очное', 'Master')
            ],
            [
                new CareerDto(1, 'COMPANY', 'site.com', 1, 'SPB', 2022, 2024, 'Developer', 'CRUDOSHLEP')
            ])
    };

    addTestData();

    const handleNextStepButtonClick = async () => {
        if (!userCV || id === undefined) return;

        let userId : number = 0;
        let user: UserDto = null;

        try {
            user = await fetchDataClient.getUserByVkId(fetchedUser!.id);
            userId = user.id;
        } catch (error: any) {
            console.error('Ошибка при получении пользователя:', error.message);
            console.log("Попытка создать нового пользователя");

            try {
                user = await saveDataClient.createUser(
                    userCV.vkId,
                    new UserCreateDto(
                        userCV.email,
                        String(fetchedUser!.id),
                        userCV.phone,
                        userCV.dateOfBirth,
                        userCV.city,
                    )
                );
                userId = user.id;

                console.log('Got user from internal API: ', user);
                if (userId != null) {
                    localStorage.setItem(StorageKeyConstants.USER_ID, String(userId));

                    routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.EDUCATION, {
                        state: { cv: userCV },
                        keepSearchParams: true,
                    });
                }
            } catch (error: any) {
                console.error('Ошибка сервера: ', error.message);
            }
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
            currentUser?.universities,
            currentUser?.workExperience,
            '',
            fetchedUser?.id)
        );

        addTestData();

        // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
        document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
        document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');
    }, []);

    return (
        <Panel id={id}>
            <Div style={{width: '90%'}}>
                <Div>
                    <Image size={64} src='/logo.svg'/>
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
                                                       margin: '10px 20px',
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
                                        placeholder='Специальность'
                                        hidePlaceholder={true}
                                        style={{
                                            multiselectContainer: {
                                                color: '#494848',
                                                fontSize: '1.1em',
                                                textAlign: 'center',
                                                minWidth: '350px',
                                                borderRadius: '30px',
                                                padding: '10px',
                                                border: 'none',
                                                backgroundColor: '#fff',
                                                maxWidth: '350px',
                                            },
                                            searchBox: {
                                                border: 'none',
                                                'border-bottom': '0px solid',
                                                color: '#fff'
                                            },
                                            inputField: {
                                                color: '#fff',
                                                textAlign: 'center',
                                                fontSize: '1.2em'
                                            }
                                        }}
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
                                        placeholder='Формат'
                                        hidePlaceholder={true}
                                        style={{
                                            multiselectContainer: {
                                                color: '#494848',
                                                fontSize: '1.1em',
                                                textAlign: 'center',
                                                minWidth: '350px',
                                                maxWidth: '350px',
                                                borderRadius: '30px',
                                                padding: '10px',
                                                border: 'none',
                                                backgroundColor: '#fff',
                                            },
                                            searchBox: {
                                                border: 'none',
                                                'border-bottom': '0px solid',
                                                color: '#fff'
                                            },
                                            inputField: {
                                                color: '#fff',
                                                textAlign: 'center',
                                                fontSize: '1.2em'
                                            }
                                        }}
                                    />
                                </Div>

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Дата
                                        рождения</Text>
                                    <DatePicker name='dateOfBirth' selected={userCV.dateOfBirth} onChange={(date) => {
                                        if (date != null) {
                                            setCV({ ...userCV, dateOfBirth: date });
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

                                <Div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>О себе</Text>
                                    <input name='summary'
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
                                           }} value={userCV.summary}
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
                            onClick={handleNextStepButtonClick}
                        >
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Перейти к следующему этапу</Text>
                        </Button>
                    </Div>

                </Div>
            </Div>


        </Panel>
    );
};
