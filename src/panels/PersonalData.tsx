import {FC, useEffect, useState} from 'react';
import {
    Panel,
    Button,
    Div,
    Avatar,
    NavIdProps, List, Text, Image,
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS, DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import {UserResumeInfo} from '../App.tsx';

export interface ResumeProps extends NavIdProps {
    fetchedUser?: UserInfo;
    currentUser?: UserResumeInfo
}

class CV {
    constructor(
        public snp: string,
        public phone: string,
        public email: string,
        public dateOfBirth: Date,
        public city: string,
        public avatar: string,
        public education: string,
        public workExperience: string
    ) {
    }
}

export const PersonalData: FC<ResumeProps> = ({id, fetchedUser, currentUser}) => {
    const [userCV, setCV] = useState<CV>(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCV({ ...userCV, [name]: value });
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
        console.log(currentUser?.education);
        console.log(currentUser?.workExperience)

        //const educationInfo = currentUser?.education.
        setCV(new CV(currentUser?.name, currentUser?.phone, currentUser?.email, currentUser?.dateOfBirth, currentUser?.city,
            currentUser?.avatar,
            formatUniversities(currentUser?.education),
            formatWorkExperience(currentUser?.workExperience)));

        // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
        document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
        document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee')

        function formatUniversities(universities: object[]): string {
            return universities.map(university => {
                const chairName = university.chair_name || 'Неизвестно';
                const educationStatus = university.education_status || 'Неизвестно';
                const facultyName = university.faculty_name || 'Неизвестно';
                const name = university.name || 'Неизвестно';

                return `Программа: ${chairName}, Статус: ${educationStatus}, Факультет: ${facultyName}, Университет: ${name}\n`;
            }).join('\n');
        }

        function formatWorkExperience(workExperiences: object[]): string {
            return workExperiences.map(work => {
                const company = work.company || 'Неизвестно';
                const position = work.position || 'Неизвестно';
                const startDate = work.from !== undefined ? work.from : 'Неизвестно';
                const endDate = work.until !== undefined ? work.until : 'н.в.';

                return `${company} - ${position} (${startDate} - ${endDate})`;
            }).join('\n');
        }
    }, []);

    return (
        <Panel id={id}>
            <Div style={{width: '100%'}}>
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

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>ФИО</Text>
                                    <input name='snp'
                                        style={{color: '#494848', fontSize: '1.5em', margin: '10px 40px', borderRadius: '30px', padding: '10px',
                                            border: 'none',
                                        backgroundColor: '#fff', minWidth: '900px', textAlign: 'center'}} value={userCV.snp} readOnly={false}
                                    onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                               minWidth: '900px',
                                               textAlign: 'center'
                                           }} value={userCV.phone}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                               minWidth: '900px',
                                               textAlign: 'center'
                                           }} value={userCV.email}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', fontSize: '1.5em', margin: '10px 40px'}}>Дата
                                        рождения</Text>
                                    <input name='dateOfBirth'
                                           style={{
                                               color: '#494848',
                                               fontSize: '1.5em',
                                               margin: '10px 40px',
                                               borderRadius: '30px',
                                               padding: '10px',
                                               border: 'none',
                                               backgroundColor: '#fff',
                                               minWidth: '900px',
                                               textAlign: 'center'
                                           }} value={userCV.dateOfBirth}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                               minWidth: '900px',
                                               textAlign: 'center'
                                           }} value={userCV.city}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                               minWidth: '900px',
                                               textAlign: 'center'
                                           }} value={userCV.education}
                                           onChange={handleChange}/>
                                </Div>

                                <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                               minWidth: '900px',
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
                        justifyContent: 'space-between',
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
                            <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Создать</Text>
                        </Button>
                    </Div>

                </Div>
            </Div>


        </Panel>
    );
};
