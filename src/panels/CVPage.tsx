import {
    Panel,
    Button,
    Div,
    List, Text, Image
} from '@vkontakte/vkui';
import {useEffect, useState} from "react";

export const CVPage = ({id}) => {

    const experience = 42;
    const grade = 4.2;
    const [advices, setAdvices] = useState<string[]>([]);

    useEffect(() => {
        setAdvices([
            'Добавьте больше информации об образовании',
            'Добавьте фото',
            'Укажите технологии, которые использовались в вашем опыте работы'
        ]);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty("--vkui--color_background", "#62a3ee");
        document.documentElement.style.setProperty("--vkui--color_background_content", "#62a3ee")
    }, []);

    return (
        <Panel id={id}>
            <Div className="header-box">
                <Image noBorder={true} style={{width: '95px', height: '65px', marginLeft: '30px', marginTop: '25px'}}
                       src='/logo.png'/>
            </Div>
            <Div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", margin: '35px'}}>

                <Text style={{color: 'white', fontSize: '32px'}}>Резюме успешно создано</Text>
                <Div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '1140px',
                    height: '620px',
                    backgroundColor: 'white',
                    borderRadius: '30px'
                }}>
                    <Div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '180px',
                        height: '70px',
                        padding: '0',
                        marginTop: '20px'
                    }}>
                        <Text style={{
                            marginLeft: '50px',
                            fontSize: '24px',
                            color: 'black'
                        }}>Скачать:</Text>
                        <Image style={{width: '75px', height: '70px'}} src='/word.png'/>
                        <Image style={{width: '75px', height: '70px'}} src='/pdf.png'/>
                        <Image style={{width: '55px', height: '70px'}} src='/html.png'/>
                    </Div>

                    <Div style={{
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0'
                    }}>
                        <Text style={{marginLeft: '50px', fontSize: '24px', color: 'black'}}>Оценка:</Text>
                        <Text style={{marginLeft: '30px', fontSize: '24px', color: 'black'}}>{grade} / 5.0</Text>
                    </Div>
                    <Div style={{
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0'
                    }}>
                        <Text style={{marginLeft: '50px', fontSize: '24px', color: 'black'}}>Начислено опыта:</Text>
                        <Text style={{marginLeft: '30px', fontSize: '24px', color: 'black'}}>{experience}</Text>
                    </Div>
                    <Div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: '32px',
                            color: 'black',
                            marginBottom: '20px'
                        }}>Советы:</Text>
                    </Div>
                    <List style={{ paddingLeft: '50px' }}>
                        {advices.map((advice, index) => (
                            <Div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <Text style={{ color: 'black', marginRight: '10px', fontSize: '24px' }}>•</Text>
                                <Text style={{ color: 'black', fontSize: '24px' }}>{advice}</Text>
                            </Div>
                        ))}
                    </List>
                </Div>

                <Button
                    size='l'
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        color: 'black',
                        height: '90px',
                        width: '320px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{color: '#747373', fontSize: '32px', display: 'inline'}}>Готово</Text>
                </Button>
            </Div>
        </Panel>
    );
};
