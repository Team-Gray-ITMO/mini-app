import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import {View, SplitLayout, SplitCol, Panel, Button} from '@vkontakte/vkui';
import {useActiveVkuiLocation, useRouteNavigator} from '@vkontakte/vk-mini-apps-router';

import { Home } from './panels';
import {DEFAULT_VIEW, DEFAULT_VIEW_PANELS} from "./routes.ts";
import {ChoosePattern} from "./panels/ChoosePattern.tsx";
import {Resume} from "./panels/Resume.tsx";
import {CVPage} from "./panels/CVPage.tsx";

export const App = () => {
  const { view: activeView, panel: activePanel } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>();

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View nav={DEFAULT_VIEW} activePanel={activePanel}>
          <Panel nav={DEFAULT_VIEW_PANELS.HOME}>
            <Home id="home" fetchedUser={fetchedUser} />
          </Panel>
          <Panel nav={DEFAULT_VIEW_PANELS.PATTERN}>
            <ChoosePattern />
          </Panel>
          <Panel nav={DEFAULT_VIEW_PANELS.CREATE}>
            <Resume id="resume" fetchedUser={fetchedUser} />
          </Panel>
        <CVPage id="cv-page"/>
    </View>
      </SplitCol>
    </SplitLayout>
  );
};
