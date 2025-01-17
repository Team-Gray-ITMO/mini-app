import {Button, Div, Image, NavIdProps, Panel, Text, ModalRoot, ModalPage, IconButton} from "@vkontakte/vkui";
import React, {FC, useEffect, useState} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import "../styles/ChoosePattern.css";
import {StorageKeyConstants} from "../storage/StorageKeyConstants.tsx";
import {FetchDataClient, TemplateBaseDto} from "../api/internal/client/FetchDataClient.ts";
import {UserInfo} from "@vkontakte/vk-bridge";
import { Icon16InfoOutline } from "@vkontakte/icons";

export interface ChoosePatternProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const ChoosePattern: FC<ChoosePatternProps> = ({ id, fetchedUser }) => {
    const fetchDataClient = new FetchDataClient();

    const [selectedPattern, setSelectedPattern] = useState<number | undefined>(undefined);
    const [patterns, setPatterns] = useState<TemplateBaseDto[]>([])
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const routeNavigator = useRouteNavigator();


    const getPatterns = async () => {
        const templates = await fetchDataClient.getTemplates(fetchedUser!.id)
        setPatterns(templates)
    }

    useEffect(() => {
        if (fetchedUser !== undefined) {
          getPatterns()
        }

        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
    }, [fetchedUser]);
    
    const handleClick = (id) => {
        localStorage.setItem(StorageKeyConstants.TEMPLATE_ID, String(id));
        setSelectedPattern(id)
    };

    return (
        <Panel id={id}>
            <Div className="header-box">
                <Image size={72} noBorder={true} style={{ marginLeft: '30px', marginTop: '25px'}}
                       src='/logo.svg'/>
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
                                <Image className="pattern-image"
                                       src={`data:image/png;base64, ${pattern.image.contentBase64}`}/>
                                <Div className="pattern-info">
                                    <Text className="pattern-name">{pattern.name}</Text>
                                    <IconButton aria-label={'Помотреть шаблон'} onClick={() => setActiveModal(pattern.id.toString())}>
                                        <Icon16InfoOutline/>
                                    </IconButton>
                                </Div>
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
            <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
                {patterns.map((pattern) => {
                    return (
                        <ModalPage key={pattern.id.toString()} id={pattern.id.toString()}>
                            <Image className="pattern-image" src={`data:image/png;base64, ${pattern.image.contentBase64}`}/>
                        </ModalPage>
                    )
                })}
            </ModalRoot>
        </Panel>
    )
}


