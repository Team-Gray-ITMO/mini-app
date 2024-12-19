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
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export class CVHistory {
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
  const fetchDataClient = new FetchDataClient();

  const [CVs, setCVs] = useState<CVHistory[]>([]);
  const [userData, setUserData] = useState<UserData>(null);

  useEffect(() => {
    if (fetchedUser) {
      const fetchResumes = async () => {
        try {
          const response = await fetchDataClient.getHistory(fetchedUser!.id)
          setCVs(response);
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

  return (
    <Panel id={id}>
        <Div className="header-box">
          <Image noBorder={true} style={{width: '95px', height: '65px', marginLeft: '30px', marginTop: '25px'}}
                 src='/logo.png'/>
          {fetchedUser &&
            <Div className="user-data-box">
              <Text className="username">{fetchedUser?.first_name}</Text>
              <Avatar noBorder={true} size={64} src={fetchedUser?.photo_max_orig}/>
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
