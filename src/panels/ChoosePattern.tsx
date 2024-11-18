import {Button, Text} from "@vkontakte/vkui";
import {useEffect} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";

export const ChoosePattern = () => {
  const patterns = ["Название шаблона", "Название шаблона", "Название шаблона"];

  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
    document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "20px"
    }}>
      <h1 style={{ color: "white" }}>Выберите шаблон</h1>
      <div style={{
        display: "flex",
        width: "70%",
        height: "60%",
        backgroundColor: "white",
        borderRadius: "10px",
        gap: "20px",
        padding: "30px"
      }}>
        {patterns.map((pattern) => {
          return (
            <div style={{ textAlign: "center"}}>
              <img style={{ width: "150px", height: "200px" }} src="/src/assets/test_pattern.png"/>
              <p style={{ color: "#747373", fontSize: "1.3em" }}>{pattern}</p>
            </div>
          )
        })}
      </div>

      <Button
        size="l"
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          color: "black",
          height: "80px",
          width: "20%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)"
        }}
        onClick={() => {
            console.log("Go to resume edit");
            routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.CREATE);
        }}
      >
        <Text style={{color: "#747373", fontSize: "2em", margin: "10px 15px"}}>Выбрать</Text>
      </Button>
    </div>
  )
}


