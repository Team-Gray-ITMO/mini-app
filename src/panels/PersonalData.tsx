import {FC, forwardRef, useEffect, useState} from 'react';
import {
    Avatar,
    Button, Checkbox,
    ChipsSelect, DateInput,
    Div, Flex,
    FormItem,
    Group,
    Image,
    Input, LocaleProvider,
    NavIdProps,
    Panel,
    PanelHeader,
    Select,
    Text, Textarea,
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/personal_data.css';
import {
    mapSpecialityDtoToVKUiMultiselectModel,
    mapVKUiMultiselectModelToSpecialityDto,
    parseDate
} from "../utils/vkApiMapping.ts";
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
import {CVDataValidator} from "../utils/CVDataValidator.ts";
import {JobAttendanceFormat} from "../enums/JobAttendanceFormat.ts";

export interface ResumeProps extends NavIdProps {
    fetchedUser?: UserInfo;
    currentUser?: UserResumeInfo
    currentUserCV?: CV
}

export const PersonalData: FC<ResumeProps> = ({id, fetchedUser, currentUser, currentUserCV}) => {
    const saveDataClient = new SaveDataClient();
    const fetchDataClient = new FetchDataClient();
    
    const [userCV, setCV] = useState<CV>(null);
    const [emailError, setEmailError] = useState('empty');
    const ExampleCustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <button className={className} onClick={onClick} ref={ref}>
                {value}
            </button>
        ),
    );

    const resumeApiClient : CVApiClient = new CVApiClient();

    const specialitiesState = {
        options: mapSpecialityDtoToVKUiMultiselectModel(resumeApiClient.getSpecialities())
    };

    const onSpecialityChange = (selectedList : {value : number, label : string}[]) => {
        setCV({ ...userCV, preferredSpecialities: mapVKUiMultiselectModelToSpecialityDto(selectedList) });
    };

    const workFormatsSelect = {
        options: resumeApiClient.getWorkFormats()
    };


    const onJobAttendanceFormatChange = (_, newValue : JobAttendanceFormat) => {
        setCV({ ...userCV, preferredJobAttendanceFormat: newValue });
    };

    const onMoveChange = (event) => {
        setCV({ ...userCV, isReadyToMove: event.target.checked });
    };

    const ERRORS_MAP = {
        empty: 'Пожалуйста, введите электронную почту',
        incorrect: 'Электронная почта некорректна',
    };

    const checkEmail = (email : string) => {
        if (!email) {
            setEmailError('empty');
        } else if (!CVDataValidator.validateEmail(email)) {
            setEmailError('incorrect');
        } else {
            setEmailError('');
        }
    };

    const onEmailChange = (value) => {
        setCV({ ...userCV, email: value });
        checkEmail(value);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCV({ ...userCV, [name]: value });
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

        currentUser = new UserResumeInfo('Лиджигоряев', 'Владимир', 'Владимир Лиджигоряев', '+743434', 'email@mail.ru', '2024-06-01', 'SPB', 'avatar',
            [
                new UniversityDto(1, 'SPB', 'ITMO', 1, 'IPKN', 1, 'DWS', 2024, 2026, 'Очное', 'Master', '')
            ],
            [
                new CareerDto(1, 'COMPANY', 'site.com', 1, 'SPB', 2022, 2024, 'Developer', 'CRUDOSHLEP')
            ]
        );
    };

    const init = ()=> {
        setCV(new CV(currentUser?.surname, currentUser?.userName, '',
            currentUser?.name,
            currentUser?.phone,
            currentUser?.email,
            null,
            [],
            null,
            parseDate(currentUser?.dateOfBirth),
            currentUser?.city,
            true,
            currentUser?.avatar,
            currentUser?.universities,
            currentUser?.workExperience,
            '',
            fetchedUser?.id)
        );

        checkEmail(currentUser?.email);
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
            } catch (error: any) {
                console.error('Ошибка сервера: ', error.message);
            }
        } finally {
            if (userId != null) {
                localStorage.setItem(StorageKeyConstants.USER_ID, String(userId));

                routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.EDUCATION, {
                    state: { cv: userCV },
                    keepSearchParams: true,
                });
            }
        }
    };

    const routeNavigator = useRouteNavigator();

    useEffect(() => {
        console.log("Got this user info in Resume.tsx: " + JSON.stringify(currentUser, null, 2));
        console.log(currentUser?.universities);
        console.log(currentUser?.workExperience)

        init();

        // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
        document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
        document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Ввод личных данных</PanelHeader>
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
                            <Group style={{backgroundColor: '#fff'}}>
                                <form onSubmit={(e) => e.preventDefault()}>

                                    <Div>

                                        <FormItem
                                            htmlFor="surname"
                                            top="Фамилия"
                                            status={CVDataValidator.validateName(userCV.surname) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateName(userCV.surname) ? '' : 'Введите фамилию'}
                                        >
                                            <Input id="surname" name='surname' value={userCV.surname} onChange={handleChange} />
                                        </FormItem>

                                        <FormItem
                                            htmlFor="name"
                                            top="Имя"
                                            status={CVDataValidator.validateName(userCV.name) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateName(userCV.name) ? '' : 'Введите имя'}
                                        >
                                            <Input id="name" name='name' value={userCV.name} onChange={handleChange} />
                                        </FormItem>

                                        <FormItem
                                            htmlFor="patronymic"
                                            top="Отчество"
                                        >
                                            <Input id="patronymic" name='patronymic' value={userCV.patronymic} onChange={handleChange} />
                                        </FormItem>

                                        <FormItem htmlFor="phone" top="Мобильный телефон">
                                            <Input id="phone" name='phone' value={userCV.phone} onChange={handleChange} />
                                        </FormItem>

                                        <FormItem
                                            htmlFor="email"
                                            top="E-mail"
                                            status={emailError ? 'error' : 'default'}
                                            bottom={emailError ? ERRORS_MAP[emailError] : ''}
                                            bottomId="email-type"
                                            required
                                        >
                                            <Input
                                                aria-labelledby="email-type"
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={userCV.email}
                                                required
                                                onChange={(e) => onEmailChange(e.currentTarget.value)}
                                            />
                                        </FormItem>

                                        <FormItem
                                            top="Предпочитаемый способ связи"
                                            htmlFor="connect-type"
                                            status={CVDataValidator.validatePreferredConnectionType(userCV.preferredConnectionType) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validatePreferredConnectionType(userCV.preferredConnectionType) ? '' : 'Пожалуйста, укажите предпочитаемый способ связи'}
                                            required
                                        >
                                            <Select
                                                id="connect-type"
                                                placeholder="Выберите способ"
                                                onChange={e => {
                                                    setCV({ ...userCV, preferredConnectionType: e.currentTarget.value as ConnectionType });
                                                }}
                                                value={userCV.preferredConnectionType}
                                                options={[
                                                    {
                                                        value: ConnectionType.EMAIL,
                                                        label: 'По электронной почте',
                                                    },
                                                    {
                                                        value: ConnectionType.PHONE,
                                                        label: 'По телефону',
                                                    },
                                                ]}
                                            />
                                        </FormItem>

                                        <FormItem
                                            htmlFor="preferredSpeciality"
                                            top="Выберите предпочитаемые специальности"
                                            required
                                            status={CVDataValidator.validatePreferredSpecialities(userCV.preferredSpecialities) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validatePreferredSpecialities(userCV.preferredSpecialities) ? '' : 'Пожалуйста, выберите специальности'}
                                        >
                                            <ChipsSelect
                                                id="preferredSpeciality"
                                                options={specialitiesState.options}
                                                value={mapSpecialityDtoToVKUiMultiselectModel(userCV.preferredSpecialities)}
                                                onChange={(data : {value : number, label: string}[]) => onSpecialityChange(data)}
                                                placeholder="Не выбраны"
                                                emptyText="Ничего не найдено"
                                                selectedBehavior="hide"
                                                closeAfterSelect={false}
                                                allowClearButton={true}
                                            />
                                        </FormItem>

                                        <FormItem
                                            top="Выберите формат работы"
                                            htmlFor="preferredJobAttendanceFormat"
                                            status={CVDataValidator.validatePreferredJobAttendanceFormat(userCV.preferredJobAttendanceFormat) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validatePreferredJobAttendanceFormat(userCV.preferredJobAttendanceFormat) ? '' : 'Пожалуйста, укажите предпочитаемый формат работы'}
                                            required
                                        >
                                            <Select
                                                id="preferredJobAttendanceFormat"
                                                placeholder="Выберите формат"
                                                onChange={e => {
                                                    setCV({ ...userCV, preferredJobAttendanceFormat: e.currentTarget.value as JobAttendanceFormat });
                                                }}
                                                value={userCV.preferredJobAttendanceFormat}
                                                options={[
                                                    {
                                                        value: JobAttendanceFormat.ON_SITE,
                                                        label: 'В офисе',
                                                    },
                                                    {
                                                        value: JobAttendanceFormat.HYBRID,
                                                        label: 'Гибридный',
                                                    },
                                                    {
                                                        value: JobAttendanceFormat.REMOTE,
                                                        label: 'Удалённый',
                                                    }
                                                ]}
                                            />
                                        </FormItem>

                                        <FormItem
                                            top="Дата рождения"
                                            htmlFor="bdate"
                                            status={CVDataValidator.validateDateOfBirth(userCV.dateOfBirth) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateDateOfBirth(userCV.dateOfBirth) ? '' : 'Введите корректную дату рождения!'}
                                            required
                                        >
                                            <Flex>
                                                <LocaleProvider value='ru'>
                                                    <DateInput
                                                        id="date"
                                                        value={userCV.dateOfBirth}
                                                        onChange={newValue => {
                                                            setCV({ ...userCV, dateOfBirth: newValue });
                                                        }}
                                                        minDateTime={CVDataValidator.MIN_BIRTH_DATE}
                                                        enableTime={false}
                                                        disablePast={false}
                                                        disableFuture={true}
                                                        closeOnChange={true}
                                                        disablePickers={false}
                                                        showNeighboringMonth={false}
                                                        disableCalendar={false}
                                                    />
                                                </LocaleProvider>
                                            </Flex>
                                        </FormItem>

                                        <FormItem
                                            htmlFor="city"
                                            top="Город проживания"
                                            status={CVDataValidator.validateCity(userCV.city) ? 'default' : 'error'}
                                            bottom={CVDataValidator.validateCity(userCV.city) ? '' : 'Введите город проживания'}
                                            required
                                        >
                                            <Input id="city" name='city' value={userCV.city} onChange={handleChange} />
                                        </FormItem>

                                        <FormItem
                                            top={
                                                <FormItem.Top>
                                                    <FormItem.TopLabel htmlFor="summary">О себе</FormItem.TopLabel>
                                                    <FormItem.TopAside>{userCV.summary.length}/{CVDataValidator.MAX_SUMMARY_LENGTH}</FormItem.TopAside>
                                                </FormItem.Top>
                                            }
                                        >
                                            <Textarea
                                                id="summary"
                                                name="summary"
                                                maxLength={CVDataValidator.MAX_SUMMARY_LENGTH}
                                                value={userCV.summary}
                                                onChange={handleChange}
                                                placeholder="Уточнения навыков, интересы, увлечения..."
                                            />
                                        </FormItem>

                                        <Checkbox
                                            onChange={e => {
                                                setCV({...userCV, isReadyToMove: e.target.checked})
                                            }}
                                            checked={userCV.isReadyToMove}
                                        >
                                            Готов(-а) к переезду или командировкам
                                        </Checkbox>
                                    </Div>

                                </form>
                            </Group>
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
