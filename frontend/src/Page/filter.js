import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import axios from 'axios';
import Home from './home.js';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

import { useNavigate } from 'react-router-dom'
import * as amplitude from "@amplitude/analytics-browser";


const Form_post = ({ data }) => {
    const navigate = useNavigate();

    const arrOfNum = data.authenticated_user.parameter_array.replace("[", "").replace("]", "").split(',').map(str => {
        return Number(str);
    })

    const [formData, setFormData] = useState({
        parameter_array: data.authenticated_user.parameter_array,
        age_filter: data.authenticated_user.age_filter,
        city_filter: data.authenticated_user.city_filter,
        country_filter: data.authenticated_user.country_filter,
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const [validated, setValidated] = useState(false);
    const [sliderValues, setSliderValues] = useState(arrOfNum);

    const [sliderValuesAge, setSliderValuesAge] = useState(data.authenticated_user.age_filter.replace("[", "").replace("]", "").split(','));

    const [selectedCountry, setSelectedCountry] = useState(data.authenticated_user.country_filter);
    const [selectedCity, setSelectedCity] = useState(data.authenticated_user.city_filter);

    const citiesByCountry = {
        Россия: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
            'Нижний Новгород', 'Казань', 'Челябинск', 'Омск', 'Самара', 'Ростов-на-Дону',
            'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград', 'Краснодар', 'Саратов', 'Тюмень', 'Тольятти'],
        Казахстан: ['Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар',
            'Усть-Каменогорск', 'Семей', 'Атырау', 'Уральск', 'Костанай',
            'Кызылорда', 'Петропавловск', 'Темиртау', 'Туркестан', 'Кокшетау', 'Рудный'],
        Армения: ['Ереван', 'Гюмри', 'Ванадзор', 'Ехегнадзор', 'Аракс',
            'Гавар', 'Абовян', 'Капан', 'Армавир', 'Артасхат', 'Сисиан',
            'Ханчин', 'Каджаран', 'Арагацотн', 'Маралик', 'Артанис', 'Нор Апаке', 'Иджеван', 'Кегам', 'Дилижан'],
        Азербайджан: ['Баку', 'Гянджа', 'Сумгаит', 'Мингечевир', 'Ленкорань', 'Нахичевань', 'Ширван', 'Саатлы', 'Ханкенди', 'Барда',
            'Мардакерт', 'Закаталы', 'Сафарли', 'Агдам',
            'Горадиз', 'Шамкир', 'Бейлаган', 'Абширон', 'Астара', 'Габала'],
        Беларусь: ['Минск', 'Гомель', 'Могилев', 'Витебск', 'Гродно', 'Брест', 'Бобруйск', 'Барановичи', 'Борисов',
            'Пинск', 'Орша', 'Мозырь', 'Солигорск', 'Новополоцк', 'Лида', 'Молодечно', 'Полоцк', 'Слуцк', 'Жлобин', 'Светлогорск'],
        Кыргызстан: ['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Токмок', 'Балыкчи', 'Талас', 'Кара-Балта', 'Кара-Куль',
            'Нарын', 'Кочкор', 'Талдыкорган', 'Исфана', 'Кант', 'Токтогул', 'Ала-Бука', 'Сулюкта', 'Ат-Баши', 'Кара-Суу', 'Сокулук'],
        Молдова: ['Кишинёв', 'Тирасполь', 'Бельцы', 'Бендеры', 'Рыбница', 'Кагул', 'Сороки', 'Орхей', 'Дубоссары', 'Комрат',
            'Дрокия', 'Каушаны', 'Корнешты', 'Хынчешты', 'Страшены', 'Каларашь', 'Окница', 'Григориополь', 'Тараклия', 'Фалешты'],
        Таджикистан: ['Душанбе', 'Худжанд', 'Куляб', 'Курган-Тюбе', 'Исфара', 'Пенджикент', 'Ишкашим', 'Шаартуз', 'Джиргаталь',
            'Бустон', 'Бохтар', 'Мургаб', 'Хорог', 'Турсунзаде', 'Конибадам', 'Истаравшан', 'Колхой', 'Вахдат', 'Табошар', 'Гафуров'],
        Узбекистан: ['Ташкент', 'Наманган', 'Самарканд', 'Андижан', 'Бухара', 'Нукус', 'Карши', 'Термез', 'Шахрисабз', 'Гулистан',
            'Фергана', 'Чирчик', 'Маргилан', 'Коканд', 'Навои', 'Зарафшан', 'Газалкент', 'Булунгур', 'Ургенч', 'Янгиюль'],
    };

    const [cities, setCities] = useState(citiesByCountry[data.authenticated_user.country_filter] || []);

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
        const selectedCities = citiesByCountry[country] || [];
        setCities(selectedCities);
        data.authenticated_user.city_filter = null
        handleChange(event);
    };

    const handleCityChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
        data.authenticated_user.city_filter = city
        handleChange(event);
    };

    const postData = () => {
        if (!data.authenticated_user.city_filter) {
            formData.city_filter = ""
        }
        axios.post('http://api.aura-ai.site/api/users/profile/', {
            country_filter: formData.country_filter,
            city_filter: formData.city_filter,
            age_filter: formData.age_filter,
            parameter_array: formData.parameter_array,
        })
            .then(response => {})
            .catch(error => {
                console.error('Error while posting data:', error);
            });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(false);

        const authTokens = localStorage.getItem('authTokens');

        const response = await fetch('http://api.aura-ai.site/api/users/profile/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(authTokens).access}`
            },
            body: JSON.stringify({
                parameter_array: JSON.stringify(sliderValues),
                age_filter: formData.age_filter,
                city_filter: formData.city_filter,
                country_filter: formData.country_filter,
            }),
        });
        if (response.status === 200) {
            const data = await response.json();
            postData();
            amplitude.track('Filter Saved Pressed');
            navigate('/card');
        } else {
            alert('Ошибка!!!');
        }
    };

    const handleSliderChange = (index, value) => {
        const updatedValues = [...sliderValues];
        updatedValues[index] = value;
        setSliderValues(updatedValues);
        formData.parameter_array = JSON.stringify(updatedValues)
    };

    const handleAgeSliderChange = (values) => {
        setSliderValuesAge(values);
        formData.age_filter = JSON.stringify(sliderValuesAge)
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
        <div className="align-items-center justify-content-center">
            <div className="d-flex vertical-center-2 flex-row justify-content-start navCustom">
                <Button onClick={() => navigate(-1)} className='arrow' variant='custom' >
                    <img className="mainSVG" src={"arrow-left.svg"} alt="options" />
                </Button>
                <a className="p-3 navCustomTitle">Фильтры</a>
            </div>
            <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>
                <div className='d-flexSlider d-flex justify-content-between'>
                    <h2 className="CustomTitle">Возраст</h2>
                    <div className='d-flexSlider d-flex justify-content-between'>
                        <h3 className="CustomTitleAge" name="age_filter">{sliderValuesAge[0]} - {sliderValuesAge[1]}</h3>
                    </div>
                </div>
                <br />
                <Slider
                    handleRender={(node, handleProps) => {
                        return (
                            <Tooltip
                                overlayInnerStyle={{ minHeight: "auto" }}
                                overlay={"score: " + handleProps.value}
                                placement="bottom"
                            >
                                {node}
                            </Tooltip>
                        );
                    }}
                    range
                    min={18}
                    max={99}
                    defaultValue={[18, 25]}
                    value={sliderValuesAge}
                    onChange={handleAgeSliderChange}
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
                ></Slider>
                <br />
                <br />
                <h4 className="CustomTitle">Место жительства</h4>
                <Form.Select className='inputCustom' name="country_filter" aria-label="Default select example" onChange={handleCountryChange} value={selectedCountry}>
                    <option className='inputCustom' value="">Страна</option>
                    <option className='inputCustom' value="Россия">Россия</option>
                    <option className='inputCustom' value="Казахстан">Казахстан</option>
                    <option className='inputCustom' value="Армения">Армения</option>
                    <option className='inputCustom' value="Азербайджан">Азербайджан</option>
                    <option className='inputCustom' value="Беларусь">Беларусь</option>
                    <option className='inputCustom' value="Кыргызстан">Кыргызстан</option>
                    <option className='inputCustom' value="Молдова">Молдова</option>
                    <option className='inputCustom' value="Таджикистан">Таджикистан</option>
                    <option className='inputCustom' value="Узбекистан">Узбекистан</option>
                </Form.Select>
                <Form.Select className='inputCustom' name="city_filter" aria-label="Default select example" onChange={handleCityChange} value={selectedCity}>
                    <option className='inputCustom' value="">Город</option>
                    {cities.map((city) => (
                        <option className='inputCustom' key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </Form.Select>
                <br />
                <h4 className="CustomTitle">Совместимость</h4>
                {renderSliders()}
                <Button className="mainButton" type="submit">
                    <div className="buttonText">Начать поиск</div>
                </Button>
            </Form>
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
        axios.get('http://api.aura-ai.site/api/user/check/')
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
