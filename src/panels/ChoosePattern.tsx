import {Button, Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import {FC, useEffect, useState} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import "../styles/ChoosePattern.css";
import {StorageKeyConstants} from "../storage/StorageKeyConstants.tsx";
import {FetchDataClient, TemplateBaseDto} from "../api/internal/client/FetchDataClient.ts";
import {UserInfo} from "@vkontakte/vk-bridge";

export interface ChoosePatternProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const ChoosePattern: FC<ChoosePatternProps> = ({ id, fetchedUser }) => {
    const fetchDataClient = new FetchDataClient();

    const [selectedPattern, setSelectedPattern] = useState<number | undefined>(null);
    const [patterns, setPatterns] = useState<TemplateBaseDto[]>([])
    
    const routeNavigator = useRouteNavigator();

    
    const getPatterns = async () => {
        const templates = await fetchDataClient.getTemplates(fetchedUser!.id)
        setPatterns(templates)
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
        getPatterns()
    }, []);
    
    const handleClick = (id) => {
        localStorage.setItem(StorageKeyConstants.TEMPLATE_ID, String(id));
        setSelectedPattern(id)
    };
    
    return (
        <Panel id={id}>
            <Div className="header-box">
                <Image noBorder={true} style={{width: '95px', height: '65px', marginLeft: '30px', marginTop: '25px'}}
                       src='/logo.png'/>
            </Div>
            <Div className="main-container-choose-pattern">
                <Text className="text-header">Выберите шаблон</Text>
                
                <Div className="patterns-box">
                    {patterns.map((pattern) => {
                        return (
                          <Div
                            key={pattern.id}
                            className={`pattern ${selectedPattern === pattern.id ? 'selected' : ''}`}
                            onClick={() => handleClick(pattern.id)}
                          >
                            <Image className="pattern-image" src="/test_pattern.png"/>
                            <Text className="pattern-name">{pattern.name}</Text>
                          </Div>
                        )
                    })}
                </Div>

              <Div style={{
                display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    margin: "30px 0",
                    gap: "50px"
                }}>
                    <Button size="s" className="choose-pattern-button" onClick={() => {
                        routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.CREATE);
                    }}>
                        <Text className="choose-pattern-button-text">Выбрать</Text>
                    </Button>
                    <Button size="l" className="choose-pattern-button" onClick={() => {
                        routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.HOME);
                    }}>
                        <Text className="choose-pattern-button-text">Назад</Text>
                    </Button>
                </Div>
            </Div>
        </Panel>
    )
}


