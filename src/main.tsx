import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.tsx';
import {StorageKeyConstants} from "./storage/StorageKeyConstants.tsx";

vkBridge.send('VKWebAppInit')
    .then((data) => {
      if (data.result) {
        console.log("App is initialized!");
      } else {
        console.log("Error occurred while initializing!");
      }
    })
    .catch((error) => {
      // Ошибка
      console.log("Error: " + error);
    });

vkBridge.send('VKWebAppGetLaunchParams')
    .then((data) => {
        if (data.vk_app_id) {
            localStorage.setItem(StorageKeyConstants.APP_ID_KEY, String(data.vk_app_id));
        } else {
            console.log("Error occurred while getting app launch params!");
        }
    })
    .catch((error) => {
        // Ошибка
        console.log("Error: ", error);
    });

createRoot(document.getElementById('root')!).render(<AppConfig />);

if (import.meta.env.MODE === 'development') {
  import('./eruda.ts');
}
