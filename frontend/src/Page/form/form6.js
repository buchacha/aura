import React, { Component, useEffect } from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Home from '../../Page/home.js';

import axios from 'axios';

import Slider from 'rc-slider';


const Form_post = ({ data }) => {

    const navigate = useNavigate();

    React.useEffect(() => {
        if (
            data.authenticated_user.parameter_array
        ) {
            navigate('/card');
        }
    }, []);

    const [validated, setValidated] = useState(false);
    const [sliderValues, setSliderValues] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const [isLoading, setIsLoading] = useState(true);


    const handleSubmit = async (event) => {
        setIsLoading(false);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const authTokens = localStorage.getItem('authTokens');

        formData.append('parameter_array', JSON.stringify(sliderValues));
        formData.append('is_profile_complete', true);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(authTokens).access}`
            },
            body: formData
        });
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            navigate('/card')
        } else {
            alert('Ошибка!!!');
        }
    };

    const handleSliderChange = (index, value) => {
        const updatedValues = [...sliderValues];
        updatedValues[index] = value;
        setSliderValues(updatedValues);
    };

    const parametrs_name = [
        "Общительность",
        "Высокий интеллект",
        "Эмоциональная стабильность",
        "Доминантность",
        "Экспрессивность",
        "Высокая нормативность поведения",
        "Смелость",
        "Чувствительность",
        "Подозрительность",
        "Мечтательность",
        "Дипломатичность",
        "Тревожность",
        "Радикализм",
        "Нонконформизм",
        "Высокий самоконтроль",
        "Напряженность"
    ]

    const renderSliders = () => {
        return sliderValues.map((value, index) => (
            <div key={index}>
                <h2 className="text-center CustomTitleH2">{parametrs_name[index]}</h2>
                <Slider
                    min={-1}
                    max={1}
                    step={1}
                    defaultValue={value}
                    value={value}
                    onChange={(value) => handleSliderChange(index, value)}
                    trackStyle={{
                        backgroundImage:
                            "linear-gradient(98deg, #CE1778 0%, #D42872 16.67%, #D8356E 29.69%, #E35762 39.58%, #EC7358 47.92%, #FFAE43 91.15%)",
                        height: 20
                    }}
                    railStyle={{ backgroundColor: "#D7D3D6", height: 20 }}
                    handleStyle={{
                        borderColor: "white",
                        height: 30,
                        width: 30,
                        marginTop: -5,
                        background: "white",
                    }}
                />
                <br />
                <div className='customD-flex d-flex justify-content-between'>
                    <h2 className='CustomTitleH3'>Минимум</h2>
                    <h2 className='CustomTitleH3'>Максимум</h2>
                </div>
                <br />
            </div>
        ));
    };

    return (
        <div>
            {!isLoading ? (
                <div className="vertical-center mainPage">
                    <div className="container justify-content-center">
                        <h1 className="text-center CustomTitle">Анализируем вашу совместимость</h1>
                        <img className="mainSVG" src={"heart_icon.svg"} alt="dots icon" />
                    </div>
                </div>
            ) : (
                <div className="align-items-center justify-content-center">
                    <div className="d-flex vertical-center-2 flex-row justify-content-between navCustom">
                        <a className="p-3 navCustomTitleActive">Совместимость</a>
                        <a className="p-3 navCustomTitleActive">6/6</a>
                    </div>
                    <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>
                        <h4 className="CustomTitle">Выбери характеристики для поиска партнера</h4>
                        <h3 className="mainText">Внимательно выберите личностные характеристики желаемого партнера — далее их можно будет изменять только на Премиум-подписке.</h3>
                        {renderSliders()}
                        <Button className="NextButtonCustom" type="submit">
                            <div className="NextButtonTextCustom">Далее</div>
                        </Button>
                    </Form>
                </div>
            )}
        </div>
    );
};

function DataComponent() {
    const [data, setData] = useState({ authenticated_user: null, });

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    } else {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/user/check/`)
            .then(response => {
                setData({
                    authenticated_user: response.data.authenticated_user
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <>
            {isLoading ? (
                <Home />
            ) : (
                <Form_post data={data} />
            )}
        </>
    );

};

export default DataComponent;
