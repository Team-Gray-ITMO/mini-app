import {useState, useEffect, ReactNode} from 'react';
import bridge, {UserInfo} from '@vkontakte/vk-bridge';
import {View} from '@vkontakte/vkui';
import {Home} from "./panels";
import {ChoosePattern} from "./panels/ChoosePattern.tsx";
import {useActiveVkuiLocation} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW_PANELS} from "./routes.ts";
import {InProcess} from "./panels/InProcess.tsx";

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
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
    <View activePanel={activePanel}>
      <Home id="home" />
      <ChoosePattern id="choose_pattern" />
      <InProcess id="in_process"/>
    </View>
  );
};
