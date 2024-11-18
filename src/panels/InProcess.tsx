import {FC, useEffect} from "react";
import {Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import './InProcess.css'


export const InProcess: FC<NavIdProps> = ({ id }) => {

  useEffect(() => {
    document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
    document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
  }, []);

  return (
    <Panel id={id}>
      <Div className="main-container">
        <Div className="loading-container">
          <Image noBorder={true} height={300} className="loading-gif" src="/src/assets/loading.gif"/>
          <Text className="loading-text">Загрузка</Text>
        </Div>
      </Div>
    </Panel>
  )
}