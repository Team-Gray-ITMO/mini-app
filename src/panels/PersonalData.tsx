import {FC, useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    ChipsSelect,
    DateInput,
    Div,
    File,
    Flex,
    FormItem,
    Image,
    Input,
    LocaleProvider,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Select,
    Textarea,
    usePlatform,
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
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
import {CVApiClient} from "../api/internal/client/CVApiClient.ts";
import {SaveDataClient, UserCreateDto} from "../api/internal/client/SaveDataClient.ts";
import {FetchDataClient, UserDto} from "../api/internal/client/FetchDataClient.ts";
import {StorageKeyConstants} from "../storage/StorageKeyConstants.tsx";
import {UniversityDto} from "../api/vk/dto/UniversityDto.ts";
import {CareerDto} from "../api/vk/dto/CareerDto.ts";
import {CVDataValidator} from "../utils/CVDataValidator.ts";
import {JobAttendanceFormat} from "../enums/JobAttendanceFormat.ts";
import {Icon24Camera} from "@vkontakte/icons";

export interface ResumeProps extends NavIdProps {
    fetchedUser?: UserInfo;
    currentUser?: UserResumeInfo
    currentUserCV?: CV
}

export const PersonalData: FC<ResumeProps> = ({id, fetchedUser, currentUser, currentUserCV}) => {
    const saveDataClient = new SaveDataClient();
    const fetchDataClient = new FetchDataClient();

    const cvParams = useMetaParams<{cv: CV}>();
    const [userCV, setCV] = useState<CV>(null);
    const [emailError, setEmailError] = useState('empty');
    const platform = usePlatform();

    const resumeApiClient : CVApiClient = new CVApiClient();

    const specialitiesState = {
        options: mapSpecialityDtoToVKUiMultiselectModel(resumeApiClient.getSpecialities())
    };

    const onSpecialityChange = (selectedList : {value : number, label : string}[]) => {
        setCV({ ...userCV, preferredSpecialities: mapVKUiMultiselectModelToSpecialityDto(selectedList) });
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAvatarFile = event.target.files?.[0]; // Получаем первый выбранный файл
        if (newAvatarFile) {
            setCV({...userCV, avatarFile: newAvatarFile})
        }
    };

    const handleTextInputChange = (event) => {
        const { name, value } = event.target;
        setCV({ ...userCV, [name]: value });
    };

    // TODO: extract to Mock objects
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
            sex: 0,
            timezone: 0,
            id: 1
        };

        currentUser = new UserResumeInfo('Специалистов', 'Специалист', 'Специалист Специалистов', '+743434533', 'email@mail.ru', '2024-06-01', 'SPB', 'avatar',
            [
                new UniversityDto(1, 'City', 'University', 1, 'Faculty', 1, 'Specialization', 2015, 2017, undefined, 'Master', '')
            ],
            [
                new CareerDto(1, 'COMPANY #1', 'http://site.com', 1, 'City #1', 2022, 2024, 'DevOps', 'Requirements', JobAttendanceFormat.ON_SITE),
                new CareerDto(2, 'COMPANY #2', 'http://site.ru', 1, 'City #2', 2022, 2024, 'Frontend', 'Requirements', JobAttendanceFormat.REMOTE)
            ]
        );
    };

    const init = ()=> {
        setCV(
            new CV(
                currentUser?.surname,
                currentUser?.userName,
                '',
                currentUser?.name,
                currentUser?.phone,
                currentUser?.email,
                undefined,
                [],
                undefined,
                parseDate(currentUser?.dateOfBirth),
                currentUser?.city,
                true,
                currentUser?.avatar,
                undefined,
                currentUser?.universities,
                currentUser?.workExperience,
                '',
                fetchedUser?.id,
                ''
            )
        );

        checkEmail(currentUser?.email);
    };

    useEffect(() => {
        if (cvParams?.cv == null) {
            console.log('CV data not found in params');
            addTestData();
            console.log("Got this user info in Resume.tsx: " + JSON.stringify(currentUser, null, 2));
            console.log(currentUser?.universities);
            console.log(currentUser?.workExperience)

            init();
        } else {
            console.log('CV data found in params')
            setCV(cvParams.cv);
            checkEmail(cvParams.cv.email);
        }
    }, [cvParams]);

    const handleNextStepButtonClick = async () => {
        if (!userCV || id === undefined) return;

        let userId : number = -1;
        let user: UserDto = null;

        try {
            user = await fetchDataClient.getUserByVkId(userCV.vkId);
            userId = user.id;
        } catch (error: any) {
            console.error('Ошибка при получении пользователя:', error.message);
            console.log("Попытка создать нового пользователя");

            try {
                user = await saveDataClient.createUser(
                    userCV.vkId,
                    new UserCreateDto(
                        userCV.email,
                        String(userCV.vkId),
                        userCV.phone,
                        userCV.dateOfBirth,
                        userCV.city,
                        userCV.preferredConnectionType
                    )
                );
                userId = user.id;

                console.log('Получен пользователь из внутреннего API: ', user);
            } catch (error: any) {
                console.error('Ошибка сервера при создании пользователя: ', error.message);
            }
        } finally {
            if (userId != -1) {
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

        // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
        document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
        document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader
                before={
                    <PanelHeaderBack
                        onClick={() => {
                            routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.PATTERN);
                        }}
                        label={platform === 'vkcom' ? 'Назад' : undefined}
                    />
                }
                style={{textAlign: 'center'}}
            >Ввод личных данных (шаг №1 / 3)</PanelHeader>
            <Div style={{width: '90%'}}>

                <Flex justify='center'>
                    <Image size={70} src='/logo.svg'/>
                </Flex>

                <Div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>

                    {userCV &&
                        <Card style={{minWidth: '90%'}}>
                            <form onSubmit={(e) => e.preventDefault()}>

                                <Div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: '20px',
                                    minWidth: '100%',
                                    justifyContent: 'center',
                                    padding: '12px 0px'
                                }}>
                                    <FormItem
                                        status={CVDataValidator.validateAvatar(userCV.avatarFile) ? 'default' : 'error'}>
                                        <Avatar size={150} src={userCV.avatar}/>
                                    </FormItem>
                                </Div>

                                <Div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: '20px',
                                    minWidth: '100%',
                                    justifyContent: 'center',
                                    padding: '12px 0px'
                                }}>
                                    <FormItem top="Загрузите ваше фото">
                                        <File
                                            before={<Icon24Camera role="presentation" />}
                                            size="m"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        >
                                            Открыть галерею
                                        </File>
                                    </FormItem>
                                </Div>

                                <FormItem
                                    htmlFor="title"
                                    top="Название резюме"
                                    status={CVDataValidator.validateCommonText(userCV.title) ? 'default' : 'error'}
                                    bottom={CVDataValidator.validateCommonText(userCV.title) ? '' : 'Введите название создаваемого резюме'}
                                    required
                                >
                                    <Input id="title" name='title' value={userCV.title} onChange={handleTextInputChange} />
                                </FormItem>

                                <FormItem
                                    htmlFor="surname"
                                    top="Фамилия"
                                    status={CVDataValidator.validateName(userCV.surname) ? 'default' : 'error'}
                                    bottom={CVDataValidator.validateName(userCV.surname) ? '' : 'Введите фамилию'}
                                >
                                    <Input id="surname" name='surname' value={userCV.surname} onChange={handleTextInputChange} />
                                </FormItem>

                                <FormItem
                                    htmlFor="name"
                                    top="Имя"
                                    status={CVDataValidator.validateName(userCV.name) ? 'default' : 'error'}
                                    bottom={CVDataValidator.validateName(userCV.name) ? '' : 'Введите имя'}
                                >
                                    <Input id="name" name='name' value={userCV.name} onChange={handleTextInputChange} />
                                </FormItem>

                                <FormItem
                                    htmlFor="patronymic"
                                    top="Отчество"
                                >
                                    <Input id="patronymic" name='patronymic' value={userCV.patronymic} onChange={handleTextInputChange} />
                                </FormItem>

                                <FormItem htmlFor="phone" top="Мобильный телефон">
                                    <Input id="phone" name='phone' value={userCV.phone} onChange={handleTextInputChange} />
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
                                    <Input id="city" name='city' value={userCV.city} onChange={handleTextInputChange} />
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
                                        onChange={handleTextInputChange}
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

                                <FormItem>
                                    <Button
                                        type="submit"
                                        size="l"
                                        stretched
                                        onClick={async _ => {
                                            await handleNextStepButtonClick()
                                        }}
                                    >
                                        Далее
                                    </Button>
                                </FormItem>

                            </form>
                        </Card>
                    }

                </Div>
            </Div>


        </Panel>
    );
};
