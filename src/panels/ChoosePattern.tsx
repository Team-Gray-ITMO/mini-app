import {Button, Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import {FC, useEffect, useState} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import "../styles/ChoosePattern.css";

export const ChoosePattern: FC<NavIdProps> = ({ id }) => {
  const patterns = ["Шаблон 1", "Шаблон 2", "Шаблон 3"]
  const [selectedPattern, setSelectedPattern] = useState<number | undefined>(null);

  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
    document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
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
                <Text className="pattern-name">{pattern}</Text>
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


