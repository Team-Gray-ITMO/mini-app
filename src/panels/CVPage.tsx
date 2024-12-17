import {
    Panel,
    Button,
    Div,
    List, Text, Image
} from '@vkontakte/vkui';
import {useEffect, useState} from "react";
import {useMetaParams, useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import '../styles/CVPage.css';
import {InProcess} from "./InProcess.tsx";
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";
import {CV} from "../models/CV.ts";
import axios from "axios";
import {ApiConstants} from "../api/internal/constants/ApiConstants.ts";

export const CVPage = ({id}) => {

    const fetchDataClient = new FetchDataClient();
    const routeNavigator = useRouteNavigator();

    const params = useParams<'id'>();

    const grade = 4.2;
    const experience = 42;
    const [advices, setAdvices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const cvParams = useMetaParams<{cv: CV}>();
    const [userCV, setCV] = useState<CV>(cvParams?.cv);

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
                const fetchedResume = await fetchDataClient.getResumeById(userCV.vkId, resumeId);
                console.log(fetchedResume)
            } catch (error) {
                console.error("Ошибка при загрузке резюме:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [id]);

    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
    }, []);

    const exportAsPdf = () => {
      if (params === undefined) {
        return
      }
      const resumeId = params.id;

      const url = `${ApiConstants.RESUME_BASE_URL}/${resumeId}/pdf`
      axios.get(url, {
        responseType: 'blob'
      }).then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `resume_${resumeId}.pdf`;
        link.click();
      })
    }

    const exportAsHtml = () => {
      if (params === undefined) {
        return
      }
      const resumeId = params.id;

      const url = `${ApiConstants.RESUME_BASE_URL}/${resumeId}/html`
      axios.get(url).then((response) => {
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `resume_${resumeId}.html`;
        link.click();
      })
    }

    const exportAsWord = async () => {
      if (params === undefined) {
        return
      }
      const resumeId = params.id;

      const url = `${ApiConstants.RESUME_BASE_URL}/${resumeId}/docx`
      axios.get(url, {
        responseType: 'blob'
      }).then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `resume_${resumeId}.docx`;
        link.click();
      })
    }

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
                    width: '80%',
                    height: '60%',
                    backgroundColor: 'white',
                    borderRadius: '30px'
                }}>
                    <Div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10%',
                        height: '3em',
                        padding: '0',
                        marginTop: '20px'
                    }}>
                        <Text style={{
                            marginLeft: '50px',
                            fontSize: '1.2em'
                        }}>Скачать:</Text>
                        <Image size={48} onClick={exportAsWord} className="upload-button"  src='/word.png'/>
                        <Image size={48} onClick={exportAsPdf} className="upload-button" src='/pdf.png'/>
                        <Image size={48} onClick={exportAsHtml} className="upload-button" src='/html.png'/>
                    </Div>

                    <Div style={{
                        height: '3em',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0'
                    }}>
                        <Text style={{marginLeft: '50px', fontSize: '1.2em'}}>Оценка:</Text>
                        <Text style={{marginLeft: '30px', fontSize: '1.2em'}}>{grade} / 5.0</Text>
                    </Div>
                    <Div style={{
                        height: '3em',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0'
                    }}>
                        <Text style={{marginLeft: '50px', fontSize: '1.2em'}}>Начислено опыта:</Text>
                        <Text style={{marginLeft: '30px', fontSize: '1.2em'}}>{experience}</Text>
                    </Div>
                    <Div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: '1.5em',
                            marginBottom: '20px'
                        }}>Советы:</Text>
                    </Div>
                    <List style={{paddingLeft: '50px'}}>
                        {advices.map((advice, index) => (
                            <Div key={index} style={{display: 'flex', alignItems: 'center', height: '3em', padding: '0'}}>
                                <Text style={{marginRight: '10px', fontSize: '1em'}}>•</Text>
                                <Text style={{fontSize: '1.2em'}}>{advice}</Text>
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
                        height: '50px',
                        width: '200px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{ color: '#494848'}}>Готово</Text>
                </Button>
            </Div>
        </Panel>
    );
};
