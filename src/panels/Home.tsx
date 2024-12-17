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
    if (fetchedUser) {
      setUserData(new UserData(fetchedUser.id, fetchedUser.first_name, fetchedUser.photo_200));

      const fetchResumes = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/resume`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data)
          const fetchedCVs = data.map((item) => new CV(item.id, item.summary, formatDate(item.createdAt)));
          setCVs(fetchedCVs);
        } catch (error) {
          console.error('Failed to fetch resumes:', error);
        }
      };

      fetchResumes();
    }

    // Set color scheme
    document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
    document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');

  }, [fetchedUser]);

  function formatDate(inputDate: string) {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

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
