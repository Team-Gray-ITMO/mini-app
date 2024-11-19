import {Button, Text} from "@vkontakte/vkui";
import {useEffect} from "react";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";

export const ChoosePattern: FC<NavIdProps> = ({ id }) => {
  const patterns = ["Название шаблона", "Название шаблона", "Название шаблона", "Название шаблона"]
  const [selectedPattern, setSelectedPattern] = useState<number | undefined>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
    document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
  }, []);

  const handleClick = (index) => {
    setSelectedPattern(index)
  };

  return (
    <Panel id={id}>
      <Div className="main-container">
        <Text className="text-header">Выберите шаблон</Text>

        <Div className="patterns-box">
          {patterns.map((pattern, index) => {
            return (
              <Div
                key={index}
                className={`pattern ${selectedPattern === index ? 'selected' : ''}`}
                onClick={() => handleClick(index)}
              >
                <Image className="pattern-image" src="/src/assets/test_pattern.png"/>
                <Text className="pattern-name">{pattern}</Text>
              </Div>
            )
          })}
        </Div>

        <Button className="button">
          <Text className="button-text">Выбрать</Text>
        </Button>
      </Div>
    </Panel>
  )
}


