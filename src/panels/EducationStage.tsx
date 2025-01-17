import {
    Button, Card,
    Div, Flex, FormItem,
    Image, Input,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack, Select,
    usePlatform
} from "@vkontakte/vkui";
import {CV} from "../models/CV.ts";
import React, {FC, useEffect, useState} from "react";
import {CVApiClient} from "../api/internal/client/CVApiClient.ts";
import {DEFAULT_VIEW_PANELS_PATHS} from "../routes.ts";
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {createNewUniversity} from "../utils/internalMapping.ts";
import {CVDataValidator} from "../utils/CVDataValidator.ts";

export interface EdProps extends NavIdProps {
    id: string;
}

export const EducationStage: FC<EdProps> = ({id}) => {
    const params = useMetaParams<{cv: CV}>();
    const routeNavigator = useRouteNavigator();

    const [userCV, setCV] = useState<CV>(params?.cv);
    const platform = usePlatform();


    console.log("Got cv in education stage: ", params?.cv);
    console.log('Set userCV in education after getting cv: ', userCV);

    const resumeApiClient : CVApiClient = new CVApiClient();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCV({ ...userCV, [name]: value });
    };

    const handleAddEducation = () => {

        const updatedEducation = userCV.education;
        updatedEducation.push(createNewUniversity());

        setCV({...userCV, education: updatedEducation});
    };

    const handleDeleteEducation = (index : number) => {
        const updatedEducation = userCV.education;
        if (index >= 0 && index < updatedEducation.length) {
            updatedEducation.splice(index, 1);
        }

        setCV({...userCV, education: updatedEducation});
    };

    const handleSubmit = async () => {
        if (!userCV) return;

        routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.WORK, {state: {cv: userCV}, keepSearchParams: true});
    };

    useEffect(() => {

        // TODO: is it legal? Possibly color scheme might be set via VK Bridge / Mini APP Config
        document.documentElement.style.setProperty('--vkui--color_background', '#62a3ee');
        document.documentElement.style.setProperty('--vkui--color_background_content', '#62a3ee');
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader
                before={
                    <Flex style={{ marginTop: "10px", marginLeft: "8px", marginBottom: "10px" }} gap={10} justify='center'>
                        <Image size={40} noBorder={true}
                               src='/logo.svg'/>
                        <PanelHeaderBack
                            onClick={() => {
                                routeNavigator.push(DEFAULT_VIEW_PANELS_PATHS.CREATE, {state: {cv: userCV}, keepSearchParams: true});
                            }}
                            label={platform === 'vkcom' ? 'Назад' : undefined}
                        />
                    </Flex>
                }
                style={{textAlign: 'center'}}
            >Ввод данных об образовании (шаг № 2 / 3)</PanelHeader>
            <Div style={{width: '90%'}}>
                <Div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>

                    <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", minWidth: '100%'}}>

                        <Card style={{minWidth: '90%'}}>
                            <form onSubmit={(e) => e.preventDefault()}>

                                {userCV.education.map((item, index) => (

                                    <Div key={index}>

                                            <FormItem
                                                htmlFor="name"
                                                top="Наименование заведения"
                                                status={CVDataValidator.validateCommonText(item.name) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateCommonText(item.name) ? '' : 'Введите наименование заведения'}
                                                required
                                            >
                                                <Input id="name" name='name' value={item.name} onChange={e => {
                                                    const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                        if (eduIndex === index) {
                                                            return {
                                                                ...eduItem,
                                                                name: e.target.value // обновляем только поле name
                                                            };
                                                        }
                                                        return eduItem; // остальные элементы остаются без изменений
                                                    });
                                                    setCV({...userCV, education: updatedEducation});
                                                }}/>
                                            </FormItem>

                                            <FormItem
                                                htmlFor="faculty"
                                                top="Факультет"
                                                status={CVDataValidator.validateCommonText(item.faculty_name) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateCommonText(item.faculty_name) ? '' : 'Введите наименование заведения'}
                                                required
                                            >
                                                <Input id="name" name='name' value={item.faculty_name} onChange={e => {
                                                    const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                        if (eduIndex === index) {
                                                            return {
                                                                ...eduItem,
                                                                faculty_name: e.target.value // обновляем только поле name
                                                            };
                                                        }
                                                        return eduItem; // остальные элементы остаются без изменений
                                                    });
                                                    setCV({...userCV, education: updatedEducation});
                                                }}/>
                                            </FormItem>

                                            <FormItem
                                                htmlFor="chair"
                                                top="Направление (программа)"
                                                status={CVDataValidator.validateCommonText(item.chair_name) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateCommonText(item.chair_name) ? '' : 'Введите наименование заведения'}
                                                required
                                            >
                                                <Input id="name" name='name' value={item.chair_name} onChange={e => {
                                                    const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                        if (eduIndex === index) {
                                                            return {
                                                                ...eduItem,
                                                                chair_name: e.target.value // обновляем только поле name
                                                            };
                                                        }
                                                        return eduItem; // остальные элементы остаются без изменений
                                                    });
                                                    setCV({...userCV, education: updatedEducation});
                                                }}/>
                                            </FormItem>

                                            <FormItem
                                                htmlFor="chair"
                                                top="Статус"
                                                status={CVDataValidator.validateCommonText(item.education_status) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateCommonText(item.education_status) ? '' : 'Введите наименование заведения'}
                                                required
                                            >
                                                <Input id="name" name='name' value={item.education_status} onChange={e => {
                                                    const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                        if (eduIndex === index) {
                                                            return {
                                                                ...eduItem,
                                                                education_status: e.target.value // обновляем только поле name
                                                            };
                                                        }
                                                        return eduItem; // остальные элементы остаются без изменений
                                                    });
                                                    setCV({...userCV, education: updatedEducation});
                                                }}/>
                                            </FormItem>

                                            <FormItem
                                                top="Форма обучения"
                                                htmlFor="education-form"
                                                status={CVDataValidator.validateEducationForm(item.education_form) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateEducationForm(item.education_form) ? '' : 'Пожалуйста, укажите форму обучения'}
                                                required
                                            >
                                                <Select
                                                    id="education-form"
                                                    placeholder="Выберите форму"
                                                    onChange={e => {
                                                        const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                            if (eduIndex === index) {
                                                                return {
                                                                    ...eduItem,
                                                                    education_form: e.target.value
                                                                };
                                                            }
                                                            return eduItem;
                                                        });
                                                        setCV({...userCV, education: updatedEducation});
                                                    }}
                                                    value={item.education_form}
                                                    options={[
                                                        {
                                                            value: 'FULL_TIME',
                                                            label: 'Очная',
                                                        },
                                                        {
                                                            value: 'PART_TIME',
                                                            label: 'Заочная',
                                                        },
                                                        {
                                                            value: 'CORRESPONDENCE',
                                                            label: 'Очно-заочная',
                                                        },
                                                    ]}
                                                />
                                            </FormItem>

                                            <FormItem
                                                htmlFor="date-start"
                                                top="Год начала обучения"
                                                status={CVDataValidator.validateEducationStartYear(item.start) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateEducationStartYear(item.start) ? '' : 'Пожалуйста, введите правильный год начала обучения'}
                                                required
                                            >
                                                <Input id="date-start" name='date-start' value={item.start} onChange={e => {
                                                    const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                        if (eduIndex === index) {
                                                            return {
                                                                ...eduItem,
                                                                start: e.target.value // обновляем только поле name
                                                            };
                                                        }
                                                        return eduItem; // остальные элементы остаются без изменений
                                                    });
                                                    setCV({...userCV, education: updatedEducation});
                                                }}/>
                                            </FormItem>

                                            <FormItem
                                                htmlFor="date-end"
                                                top="Год выпуска"
                                                status={CVDataValidator.validateEducationGraduationYear(item.graduation, item.start) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateEducationGraduationYear(item.graduation, item.start) ? '' : 'Пожалуйста, введите правильный год окончания обучения'}
                                                required
                                            >
                                                <Input id="date-end" name='date-end' value={item.graduation}
                                                       onChange={e => {
                                                           const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                               if (eduIndex === index) {
                                                                   return {
                                                                       ...eduItem,
                                                                       graduation: e.target.value
                                                                   };
                                                               }
                                                               return eduItem;
                                                           });
                                                           setCV({...userCV, education: updatedEducation});
                                                       }}/>
                                            </FormItem>

                                            <FormItem
                                                htmlFor="grade"
                                                top="Средняя оценка за обучение"
                                                status={CVDataValidator.validateEducationGrade(item.grade) ? 'default' : 'error'}
                                                bottom={CVDataValidator.validateEducationGrade(item.grade) ? '' : 'Пожалуйста, введите среднюю оценку за обучение'}
                                                required
                                            >
                                                <Input id="grade" name='grade' value={item.grade} onChange={e => {
                                                    const updatedEducation = userCV.education.map((eduItem, eduIndex) => {
                                                        if (eduIndex === index) {
                                                            return {
                                                                ...eduItem,
                                                                grade: e.target.value // обновляем только поле name
                                                            };
                                                        }
                                                        return eduItem; // остальные элементы остаются без изменений
                                                    });
                                                    setCV({...userCV, education: updatedEducation});
                                                }}/>
                                            </FormItem>

                                            <FormItem>
                                                <Button
                                                    type="button"
                                                    size="l"
                                                    stretched
                                                    onClick={_ => {
                                                        handleDeleteEducation(index)
                                                    }}
                                                >
                                                    Убрать образовательное учреждение
                                                </Button>
                                            </FormItem>

                                            <hr/>
                                </Div>
                            ))}

                            <FormItem>
                                <Button
                                    type="button"
                                    size="l"
                                    stretched
                                    onClick={_ => {
                                        handleAddEducation()
                                    }}
                                >
                                    Добавить место обучения
                                </Button>
                            </FormItem>

                            <FormItem>
                                <Button
                                    type="submit"
                                    size="l"
                                    stretched
                                    onClick={_ => {
                                        handleSubmit()
                                    }}
                                >
                                    Перейти к следующему шагу
                                </Button>
                            </FormItem>
                            </form>
                        </Card>
                    </Div>

                </Div>
            </Div>


        </Panel>
    );
};
