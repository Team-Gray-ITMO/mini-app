import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import {View, SplitLayout, SplitCol, Panel, Button} from '@vkontakte/vkui';
import {useActiveVkuiLocation, useRouteNavigator} from '@vkontakte/vk-mini-apps-router';

import { Home } from './panels';
import {DEFAULT_VIEW, DEFAULT_VIEW_PANELS} from "./routes.ts";
import {ChoosePattern} from "./panels/ChoosePattern.tsx";
import {PersonalData} from "./panels/PersonalData.tsx";
import {CVPage} from "./panels/CVPage.tsx";
import {UserResumeInfo} from "./models/UserResumeInfo.ts";
import {mapCareers, mapUniversities} from './utils/vkApiMapping.ts';

export const App = () => {
  const { view: activeView, panel: activePanel } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [currentUser, setCurrentUser] = useState<UserResumeInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>();

  useEffect(() => {
    async function fetchData() {
      const token = (await bridge.send('VKWebAppGetAuthToken', {
        app_id: 52383323,
        scope: 'friends,status,pages'
      })).access_token;

      const user = await bridge.send('VKWebAppGetUserInfo');
      console.log("User (native VK BRIDGE): " + JSON.stringify(user, null, 2));

      const userFromAPI = (await bridge.send('VKWebAppCallAPIMethod', {
        method: 'users.get',
        params: {
          v: '5.131',
          fields: 'about,activities,bdate,career,city,country,education,interests,nickname,universities',
          access_token: token
        }})).response[0];

      console.log("User from API: " + JSON.stringify(userFromAPI, null, 2));

      const userEmail = await bridge.send('VKWebAppGetEmail');
      const userPhone = await bridge.send('VKWebAppGetPhoneNumber');

      const resumeInfo = new UserResumeInfo(
          userFromAPI.first_name + " " + userFromAPI.last_name,
          userPhone.phone_number,
          userEmail.email,
          userFromAPI.bdate,
          userFromAPI.city.title,
          user.photo_max_orig,
          mapUniversities(userFromAPI.universities),
          mapCareers(userFromAPI.career));

      console.log(resumeInfo);

      setUser(user);
      setCurrentUser(resumeInfo);
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
            <PersonalData id="personal-data" fetchedUser={fetchedUser} currentUser={currentUser} />
          </Panel>
          <Panel nav={DEFAULT_VIEW_PANELS.CV_PAGE}>
            <CVPage id="cv-page"/>
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
