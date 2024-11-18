import {FC, useEffect, useState} from 'react';
import {
  Panel,
  Button,
  Div,
  Avatar,
  NavIdProps, List, Text, Image,
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import './Home.css'

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

class CV {
  constructor(
    public id: number,
    public name: string,
    public creationTime: string,
  ) {
  }
}

// TODO: can use UserInfo from VK Bridge after supporting it
class UserData {
  constructor(
    public id: number,
    public name: string,
    public avatar: string,
  ) {
  }
}

export const Home: FC<HomeProps> = ({id}) => {
  const routeNavigator = useRouteNavigator();

  const [CVs, setCVs] = useState<CV[]>([]);
  const [userData, setUserData] = useState<UserData>(null);

  useEffect(() => {
    setCVs([
      new CV(1, 'Резюме фронтенд разработчика', '21.07.2024 23:30:34'),
      new CV(2, 'Резюме бэкенд разработчик', '21.07.2024 13:30:34'),
      new CV(2, 'Резюме аналитика', '19.07.2024 12:28:31'),
      new CV(2, 'Резюме DevOps', '17.07.2024 09:19:01')
    ]);
    setUserData(new UserData(1, 'Александр', '/src/assets/persik.png'))

    // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
    document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
    document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee')
  }, []);

  return (
    <Panel id={id}>
      <Div>
        <Div className="header-box">
          <Image noBorder={true} size={70} src='/logo.svg'/>
          {userData &&
            <Div className="user-data-box">
              <Text className="username">{userData.name}</Text>
              <Avatar noBorder={true} size={70} src={userData.avatar}/>
            </Div>
          }
        </Div>
      </Div>

      <Div className="history-box">
        <Text style={{color: 'white', fontSize: '2em'}}>История</Text>
        <List className="history-list">
          {CVs.map((CV) =>
            <Div className="history-item-box" key={CV.id}>
              <Text className="history-text">{CV.name}</Text>
              <Text className="history-text">{CV.creationTime}</Text>
            </Div>)}
        </List>
      </Div>

      <Div className="button-box">
        <Button onClick={() => routeNavigator.push('choose_pattern')} className="button">
          <Text className="button-text">Создать резюме</Text>
        </Button>
      </Div>
    </Panel>
  );
};
