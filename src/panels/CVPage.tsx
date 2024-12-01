import {
    Panel,
    Button,
    Div,
    List, Text, Image
} from '@vkontakte/vkui';
import {useEffect, useState} from "react";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import '../styles/CVPage.css';
import {InProcess} from "./InProcess.tsx";

export const CVPage = ({id}) => {

    const routeNavigator = useRouteNavigator();
    const {id: resumeId} = useParams();
    const grade = 4.2;
    const experience = 42;
    const [advices, setAdvices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setAdvices([
            'Добавьте больше информации об образовании',
            'Добавьте фото',
            'Укажите технологии, которые использовались в вашем опыте работы'
        ]);
    }, []);

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                const response = await fetch(`https://localhost:8080/resumes/${resumeId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data)
            } catch (error) {
                console.error("Ошибка при загрузке резюме:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [resumeId]);

    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
    }, []);

    if (loading) {
        return (
            <InProcess/>
        );
    }

    return (
        <Panel id={id} className="cv-page">
            <Div className="header-box">
                <Image noBorder={true} style={{width: '95px', height: '65px', marginLeft: '30px', marginTop: '25px'}}
                       src='/logo.png'/>
            </Div>
            <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", margin: '35px'}}>

                <Text style={{color: 'white', fontSize: '32px'}}>Резюме успешно создано</Text>
                <Div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '1140px',
                    height: '620px',
                    backgroundColor: 'white',
                    borderRadius: '30px'
                }}>
                    <Div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '180px',
                        height: '70px',
                        padding: '0',
                        marginTop: '20px'
                    }}>
                        <Text style={{
                            marginLeft: '50px',
                            fontSize: '24px'
                        }}>Скачать:</Text>
                        <Image className="upload-button" style={{width: '75px', height: '70px'}} src='/word.png'/>
                        <Image className="upload-button" style={{width: '75px', height: '70px'}} src='/pdf.png'/>
                        <Image className="upload-button" style={{width: '55px', height: '70px'}} src='/html.png'/>
                    </Div>

                    <Div style={{
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0'
                    }}>
                        <Text style={{marginLeft: '50px', fontSize: '24px'}}>Оценка:</Text>
                        <Text style={{marginLeft: '30px', fontSize: '24px'}}>{grade} / 5.0</Text>
                    </Div>
                    <Div style={{
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0'
                    }}>
                        <Text style={{marginLeft: '50px', fontSize: '24px'}}>Начислено опыта:</Text>
                        <Text style={{marginLeft: '30px', fontSize: '24px'}}>{experience}</Text>
                    </Div>
                    <Div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: '32px',
                            marginBottom: '20px'
                        }}>Советы:</Text>
                    </Div>
                    <List style={{paddingLeft: '50px'}}>
                        {advices.map((advice, index) => (
                            <Div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <Text style={{marginRight: '10px', fontSize: '24px'}}>•</Text>
                                <Text style={{fontSize: '24px'}}>{advice}</Text>
                            </Div>
                        ))}
                    </List>
                </Div>

                <Button
                    size='l'
                    onClick={() => routeNavigator.push('/')}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        height: '90px',
                        width: '320px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{fontSize: '32px', display: 'inline', color: '#494848'}}>Готово</Text>
                </Button>
            </Div>
        </Panel>
    );
};
