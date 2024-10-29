import { useState } from 'react';
import {
    View,
    PanelHeader,
    Panel,
    Group, CellButton, Button
} from '@vkontakte/vkui';

import LogoImage from './assets/logo.png';
import AvatarImage from './assets/avatar.png';

export const App = () => {
  /*const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner size="large" />);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

   */

  const [activePanel, setActivePanel] = useState('panel1');

  return (
      <View activePanel={activePanel}>
        <Panel id="panel1">
          <PanelHeader>Страница заполнения личных данных</PanelHeader>
          <Group>
              <div style={{ padding: 20, backgroundColor: '#62A3EE' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <img width={95} src={LogoImage} alt="VK Logo"/>
                      </div>

                      <div style={{display: 'flex', justifyContent: 'space-around'}}>
                          <img width={250} src={AvatarImage} alt="Avatar"/>
                      </div>
                      <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          width: '70%',
                          alignItems: 'center',
                          margin: '0 auto'
                      }}>
                          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 20}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                                  <p>
                                      Имя и фамилия
                                  </p>
                                  <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      backgroundColor: '#fff',
                                      color: '#494848',
                                      alignItems: "center",
                                      borderRadius: '30%',
                                      width: '900px',
                                      maxWidth: '100%',
                                      height: '50px'
                                  }}>
                                      <div>
                                          Павел Дуров
                                      </div>
                                  </div>
                              </div>
                          </div>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                                  <p>
                                      Телефон
                                  </p>
                                  <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      backgroundColor: '#fff',
                                      color: '#494848',
                                      alignItems: "center",
                                      borderRadius: '30%',
                                      width: '900px',
                                      maxWidth: '100%',
                                      height: '50px'
                                  }}>
                                      <div>
                                          +78127775533
                                      </div>
                                  </div>
                              </div>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                                  <p>
                                      Email
                                  </p>
                                  <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      backgroundColor: '#fff',
                                      color: '#494848',
                                      alignItems: "center",
                                      borderRadius: '30%',
                                      width: '900px',
                                      maxWidth: '100%',
                                      height: '50px'
                                  }}>
                                      <div>
                                          pavel.durov@mail.ru
                                      </div>
                                  </div>
                              </div>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                                  <p>
                                      Образование
                                  </p>
                                  <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      backgroundColor: '#fff',
                                      color: '#494848',
                                      alignItems: "center",
                                      borderRadius: '30%',
                                      width: '900px',
                                      maxWidth: '100%',
                                      height: '50px'
                                  }}>
                                      <div>
                                          Университет ИТМО
                                      </div>
                                  </div>
                              </div>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                                  <p>
                                      Опыт работы
                                  </p>
                                  <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      backgroundColor: '#fff',
                                      color: '#494848',
                                      alignItems: "center",
                                      borderRadius: '30%',
                                      width: '900px',
                                      maxWidth: '100%',
                                      height: '50px'
                                  }}>
                                      <div>
                                          VK - c 2025г.
                                      </div>
                                  </div>
                              </div>
                      </div>
                  </div>

                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '50%',
                                margin: '0 auto'}}>
                      <Button>Вернуться</Button>
                      <Button>Создать</Button>
                  </div>

              </div>
              <div style={{height: 100, backgroundColor: '#fff'}}/>
              <CellButton onClick={() => setActivePanel('panel2')}>Go to panel 2</CellButton>
              <div style={{height: 600}}/>
          </Group>
        </Panel>
          <Panel id="panel2">
              <PanelHeader>Panel 2</PanelHeader>
              <Group>
                  <div style={{height: 200}}/>
                  <CellButton onClick={() => setActivePanel('panel3')}>Go to panel 3</CellButton>
                  <div style={{height: 600}}/>
              </Group>
          </Panel>
          <Panel id="panel3">
              <PanelHeader>Panel 3</PanelHeader>
              <Group>
                  <div style={{height: 200}}/>
                  <CellButton onClick={() => setActivePanel('panel1')}>Back to panel 1</CellButton>
                  <div style={{height: 600}}/>
              </Group>
          </Panel>
      </View>
  );
};