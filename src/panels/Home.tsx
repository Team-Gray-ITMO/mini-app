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

export const Home: FC<HomeProps> = ({id, fetchedUser}) => {
  const [CVs, setCVs] = useState<CV[]>([]);
  const [userData, setUserData] = useState<UserData>(null);

  const routeNavigator = useRouteNavigator();

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
        <Div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: '0'}}>
          <Image size={70} src='/logo.svg'/>
          {userData &&
            <Div style={{display: "flex", gap: "50px", alignItems: "center"}}>
              <Text style={{fontSize: '1.5em', color: 'white'}}>{userData.name}</Text>
              <Avatar size={70} src={userData.avatar}/>
            </Div>
          }
        </Div>
      </Div>

      <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px"}}>
        <Text style={{color: 'white', fontSize: '2em'}}>История</Text>
        <List style={{backgroundColor: 'white', width: '75%', borderRadius: '30px'}}>
          {CVs.map((CV) =>
            <Div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} key={CV.id}>
              <Text style={{color: '#747373', fontSize: '1.5em', margin: '10px 40px'}}>{CV.name}</Text>
              <Text style={{color: '#747373', fontSize: '1.5em', margin: '10px 40px'}}>{CV.creationTime}</Text>
            </Div>)}
        </List>
      </Div>

      <Div style={{display: 'flex', justifyContent: 'center', margin: '30px 0'}}>
        <Button
          size='l'
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            color: 'black',
            height: '80px',
            width: '20%',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
          }}
          onClick={() => {
            routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.PATTERN);
          }}>
          <Text style={{color: '#747373', fontSize: '2em', margin: '10px 15px'}}>Создать резюме</Text>
        </Button>
      </Div>
    </Panel>
  );
};
