import {
  Panel,
  Button,
  Div,
  List, Text, Image, NavIdProps
} from '@vkontakte/vkui';
import {FC, useEffect, useState} from "react";
import {useMetaParams, useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import '../styles/CVPage.css';
import {InProcess} from "./InProcess.tsx";
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";
import {CV} from "../models/CV.ts";
import {UserInfo} from "@vkontakte/vk-bridge";

export interface CVPageProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const CVPage: FC<CVPageProps> = ({id, fetchedUser}) => {

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
      const resumeId = params!.id!;

      fetchDataClient.getResumeAsPdf(parseInt(resumeId), fetchedUser!.id)
    }

    const exportAsHtml = () => {
      const resumeId = params!.id!;

      fetchDataClient.getResumeAsHtml(parseInt(resumeId), fetchedUser!.id)
    }

    const exportAsWord = async () => {
      const resumeId = params!.id!;

      fetchDataClient.getResumeAsDocx(parseInt(resumeId), fetchedUser!.id)
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
                        margin: '20px'
                    }}>
                        <Text style={{
                            marginLeft: '50px',
                            fontSize: '1.2em'
                        }}>Скачать:</Text>
                        <Image size={48} onClick={exportAsWord} className="upload-button"  src='/word.png'/>
                        <Image size={48} onClick={exportAsPdf} className="upload-button" src='/pdf.png'/>
                        <Image size={48} onClick={exportAsHtml} className="upload-button" src='/html.png'/>
                    </Div>

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
