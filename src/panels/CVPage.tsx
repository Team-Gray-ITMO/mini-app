import {
    Panel,
    Button,
    Div,
    List, Text, Image
} from '@vkontakte/vkui';
import {useEffect, useState} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import '../styles/CVPage.css';
import html2pdf from "html2pdf.js";
import { saveAs } from 'file-saver';
import HTMLtoDOCX from 'html-to-docx';

export const CVPage = ({id}) => {

    const routeNavigator = useRouteNavigator();
    const grade = 4.2;
    const experience = 42;
    const [advices, setAdvices] = useState<string[]>([]);

    useEffect(() => {
        setAdvices([
            'Добавьте больше информации об образовании',
            'Добавьте фото',
            'Укажите технологии, которые использовались в вашем опыте работы'
        ]);
    }, []);

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
                        <Image onClick={exportAsWord} className="upload-button" style={{width: '75px', height: '70px'}} src='/word.png'/>
                        <Image onClick={exportAsPdf} className="upload-button" style={{width: '75px', height: '70px'}} src='/pdf.png'/>
                        <Image onClick={exportAsHtml} className="upload-button" style={{width: '55px', height: '70px'}} src='/html.png'/>
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
