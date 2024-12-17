import {
    Panel,
    Button,
    Div,
    List, Text, Image
} from '@vkontakte/vkui';
import {useEffect, useState} from "react";
import {useMetaParams, useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import '../styles/CVPage.css';
import html2pdf from "html2pdf.js";
import { saveAs } from 'file-saver';
import HTMLtoDOCX from 'html-to-docx';
import {InProcess} from "./InProcess.tsx";
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";
import {CV} from "../models/CV.ts";

export const CVPage = ({id}) => {

    const fetchDataClient = new FetchDataClient();
    const routeNavigator = useRouteNavigator();
    const {id: resumeId} = useParams();
    const grade = 4.2;
    const experience = 42;
    const [advices, setAdvices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const params = useMetaParams<{cv: CV}>();
    const [userCV, setCV] = useState<CV>(params?.cv);

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
    }, [resumeId]);

    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
    }, []);

    const htmlString = `
        <div>
          <h1 style="font-size: 40px">Резюме по шаблону</h1>
          <h3 style="font-size: 25px">Александр Александров</h3>
          <p style="font-size: 20px">Опыт работы</p>
          <div style="margin-left: 20px">
           <p><b>ВК 02.2020 – настоящее время</b></p>
           <p>Разрабатывал новостную ленту</p>
          </div>  
        </div>
      `;

    const exportAsPdf = () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      document.body.appendChild(tempDiv);

      html2pdf().from(tempDiv).set({
        margin: 0,
        filename: 'CV.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).save()

      document.body.removeChild(tempDiv);
    }

    const exportAsHtml = () => {
      const blob = new Blob([htmlString], { type: 'text/plain' });
      saveAs(blob, 'CV.txt');
    }

    const exportAsWord = async () => {
      const fileBuffer = await HTMLtoDOCX(htmlString, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });

      const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, 'CV.docx');
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
