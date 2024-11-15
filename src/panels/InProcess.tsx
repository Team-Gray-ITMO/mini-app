import {useEffect} from "react";


export const InProcess = () => {

  useEffect(() => {
    document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
    document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
      <div style={{ height: "70%", width: "70%", backgroundColor: "white", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="/src/assets/loading.gif" style={{ height: "400px", width: "400px"}}/>
        <p style={{ color: "#747373", fontSize: "1.6em" }}>Загрузка</p>
      </div>
    </div>
  )
}