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
import '../styles/Home.css'
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";

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

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();

  const [CVs, setCVs] = useState<CV[]>([]);
  const [userData, setUserData] = useState<UserData>(null);

  useEffect(() => {
    setCVs([
      new CV(1, 'Резюме фронтенд разработчика', '21.07.2024 23:30:34'),
      new CV(2, 'Резюме бэкенд разработчик', '21.07.2024 13:30:34'),
      new CV(3, 'Резюме аналитика', '19.07.2024 12:28:31'),
      new CV(4, 'Резюме DevOps', '17.07.2024 09:19:01')
    ]);
    if (fetchedUser) {
      setUserData(new UserData(fetchedUser.id, fetchedUser.first_name, fetchedUser.photo_200));

      const fetchResumes = async () => {
        try {
          const response = await fetch(`http://localhost:8080/resumes/history/${fetchedUser.id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const fetchedCVs = data.map((item) => new CV(item.id, item.name, item.creationTime));
          setCVs(fetchedCVs);
        } catch (error) {
          // TODO: Test data. Remove when frontend -> backend interaction will be established
          setCVs([
            new CV(1, 'Резюме фронтенд разработчика', '21.07.2024 23:30:34'),
            new CV(2, 'Резюме бэкенд разработчик', '21.07.2024 13:30:34'),
            new CV(3, 'Резюме аналитика', '19.07.2024 12:28:31'),
            new CV(4, 'Резюме DevOps', '17.07.2024 09:19:01')
          ]);
          console.error('Failed to fetch resumes:', error);
        }
      };

      fetchResumes();
    }

    // Set color scheme
    document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
    document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');

  }, [fetchedUser]);

  return (
    <Panel id={id}>
        <Div className="header-box">
          <Image noBorder={true} style={{width: '95px', height: '65px', marginLeft: '30px', marginTop: '25px'}}
                 src='/logo.png'/>
          {userData &&
            <Div className="user-data-box">
              <Text className="username">{userData.name}</Text>
              <Avatar noBorder={true} size={64} src={userData.avatar}/>
            </Div>
          }
        </Div>

      <Div className="history-box">
        <Text style={{color: 'white', fontSize: '2em'}}>История</Text>
        <List className="history-list">
          {CVs.map((CV) => (
              <Div
                  className="history-item-box"
                  key={CV.id}
                  onClick={() => routeNavigator.push(`/cv-page/${CV.id}`)}
                  style={{cursor: 'pointer'}}
              >
                <Text className="history-text">{CV.name}</Text>
                <Text className="history-text">{CV.creationTime}</Text>
              </Div>
          ))}
        </List>

      </Div>

      <Div className="button-box">
        <Button size="l" onClick={() => routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.PATTERN)} className="button">
          <Text  className="button-text">Создать резюме</Text>
        </Button>
      </Div>
    </Panel>
  );
};
