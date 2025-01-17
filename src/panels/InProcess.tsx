import React, {FC, useEffect} from "react";
import {Div, Image, NavIdProps, Panel, Text} from "@vkontakte/vkui";
import '../styles/InProcess.css'


export const InProcess: FC<NavIdProps> = ({id}) => {

    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
    }, []);

    return (
        <Panel id={id}>
            <Div className="header-box">
                <Image size={72} noBorder={true} style={{ marginLeft: '30px', marginTop: '25px'}}
                       src='/logo.svg'/>
            </Div>
            <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", margin: '35px'}}>
                <Div className="main-container">
                    <Image noBorder={true} height={300} className="loading-gif" src="/loading.gif"/>
                    <Text className="loading-text">Загрузка</Text>
                </Div>
            </Div>
        </Panel>
    )
}