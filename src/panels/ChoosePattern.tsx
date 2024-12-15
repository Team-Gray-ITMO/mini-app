import {Button, Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import {FC, useEffect, useState} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import "../styles/ChoosePattern.css";
import axios from "axios";

export class Pattern {
    constructor(
        public id : number,
        public name: string,
        public content: string
    ) { }
}

export const ChoosePattern: FC<NavIdProps> = ({ id }) => {
    const [selectedPattern, setSelectedPattern] = useState<number | undefined>(null);
    const [patterns, setPatterns] = useState<Pattern[]>([])
    
    const routeNavigator = useRouteNavigator();
    
    const getPatterns = async () => {
        const allTemplates = "http://localhost:8080/api/v1/template"
      // TODO: Test data. Remove when frontend -> backend interaction will be established
        const defaultTestPatterns = [new Pattern(1, "Шаблон 1", ""), new Pattern(2, "Шаблон 2", ""), new Pattern(3, "Шаблон 3", "")]
        axios.get(allTemplates).then((response) => {
            const patterns = response.data
            if (patterns.length == 0) {
              setPatterns(defaultTestPatterns)
              return
            }
            setPatterns(patterns)
        }).catch((err) => {
            setPatterns(defaultTestPatterns)
        })
    }
    
    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
        getPatterns()
    }, []);
    
    const handleClick = (index) => {
        setSelectedPattern(index)
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
                    {patterns.map((pattern, index) => {
                        return (
                            <Div
                                key={index}
                                className={`pattern ${selectedPattern === index ? 'selected' : ''}`}
                                onClick={() => handleClick(index)}
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


