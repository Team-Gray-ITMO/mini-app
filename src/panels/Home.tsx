import React, {FC, useEffect, useState} from 'react';
import {
    Panel,
    Button,
    Div,
    Avatar,
    NavIdProps, List, Text, Image, IconButton,
    Input,
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import '../styles/Home.css'
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import {FetchDataClient} from "../api/internal/client/FetchDataClient.ts";
import { Icon20Check } from "@vkontakte/icons";
import {ResumeUpdateDto, SaveDataClient} from "../api/internal/client/SaveDataClient.ts";

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

const saveDataClient = new SaveDataClient();
const fetchDataClient = new FetchDataClient();

const EditableField = ({ vkId, resumeId, defaultName, creationTime }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(defaultName);
    const routeNavigator = useRouteNavigator();

    return (
        <Div
            className="history-item-box"
            key={resumeId}
            onClick={() => routeNavigator.push(`/cv-page/${resumeId}`)}
            style={{cursor: 'pointer', zIndex: 1}}
        >
            {isEditing ? (
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onClick={(e) => {e.stopPropagation()}}
                    className="history-text"
                />
            ) : (
                <Text
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true)
                    }}
                    style={{zIndex: 2}}
                    className="history-text">{value}
                </Text>
            )}
            <Text className="history-text" style={{ textAlign: "right" }}>{creationTime}</Text>
            <IconButton aria-label={'Подтвердить'} onClick={(e) => {
                e.stopPropagation();
                if (isEditing) {
                    saveDataClient.updateResume(vkId, new ResumeUpdateDto(resumeId, null, null, value))
                }
                setIsEditing(!isEditing)
            }}>
                {isEditing ? <Icon20Check /> : null}
            </IconButton>
        </Div>
    );
};

export class CVHistory {
  constructor(
    public id: number,
    public name: string,
    public creationTime: string,
  ) {
  }
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();

  const [CVs, setCVs] = useState<CVHistory[]>([]);

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
              <Image size={72} noBorder={true} style={{ marginLeft: '30px', marginTop: '25px'}}
                     src='/logo.svg'/>
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
                      <EditableField key={CV.id} vkId={fetchedUser!.id} resumeId={CV.id} defaultName={CV.name} creationTime={CV.creationTime} />
                  ))}
              </List>

          </Div>

          <Div className="button-box">
              <Button size="l" onClick={() => routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.PATTERN)}
                      className="button">
                  <Text className="button-text">Создать резюме</Text>
              </Button>
          </Div>
      </Panel>
  );
};
