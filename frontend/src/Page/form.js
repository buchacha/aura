import React, { useEffect } from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, ButtonGroup, ToggleButton } from "react-bootstrap";
import "rc-slider/assets/index.css";
import "../Component/common.css"
import axios from 'axios';
import Home from './home.js';

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import ru from 'date-fns/locale/ru';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';

import { useNavigate } from 'react-router-dom';



const Form_post = ({ data }) => {

    var dateString = "01/01/1990"

    const [startDate, setStartDate] = useState(new Date(dateString));

    registerLocale('ru', ru)

    const Calendar = () => {
        const years = range(1900, getYear(new Date()) - 17, 1);
        const months = [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
        ];
        return (
            <DatePicker onFocus={(e) => e.target.blur()} className='inputCustom fix-keybord' id="age" name="age" autoComplete="off" placeholderText={"ДД/ММ/ГГГГ"}
                dateFormat="dd/MM/yyyy"
                locale="ru"
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div
                        style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button variant="light" className='calendarNavigateButtonLeft' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {"<"}
                        </Button>
                        <select
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(value)}
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            value={months[getMonth(date)]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <Button variant="light" className='calendarNavigateButtonRight' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {">"}
                        </Button>
                    </div>
                )}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
            />
        );
    };

    const navigate = useNavigate();

    React.useEffect(() => {
        if (
            data.authenticated_user.name &&
            data.authenticated_user.age &&
            data.authenticated_user.city &&
            data.authenticated_user.country &&
            data.authenticated_user.sex
        ) {
            navigate('/form2');
        }
    }, []);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [cities, setCities] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: '',
        country: '',
        city: ''
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
        setSelectedCity('');
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
        const selectedCities = citiesByCountry[country] || [];
        formData.country = country
        const firstCity = selectedCities[0];
        setCities(selectedCities);
        handleChange(event);
    };

    const [radioValue, setRadioValue] = useState('1');

    function GetToggleButton() {
        const radios = [
            { name: 'Men', value: 'Муж.', photo: ["male_button_1.svg", "male_button_2.svg"] },
            { name: 'Female', value: 'Жен.', photo: ["female_button_1.svg", "female_button_2.svg"] },
        ];

        return (
            <>
                <ButtonGroup className='customD-flex d-flex justify-content-between' >
                    {radios.map((radio, idx) => (
                        <ToggleButton className="sexButton border-0 bg-transparent"

                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            name="sex"
                            variant="outline-light"
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                        >
                            <img src={radio.photo[radioValue === radio.value ? 1 : 0]} alt="sign" className='sexButtonImg' />
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </>
        );
    }

    const handleCityChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
        formData.city = city;
        handleChange(event);
    };

    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(false);

        const authTokens = localStorage.getItem('authTokens')

        if (!formData.name || !document.getElementById('age').getAttribute('value') || !radioValue || !formData.country || !formData.city) {
            setIsPopupOpen(true)
        } else {
            setIsPopupOpen(false)

            const response = await fetch('http://api.aura-ai.site/api/users/profile/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(authTokens).access}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    age: document.getElementById('age').getAttribute('value'),
                    sex: radioValue,
                    country: formData.country,
                    city: formData.city
                })
            })
            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                navigate('/form2')
            } else {
                alert('Ошибка!!!')
            }
        }
    };

    return (
        <div className={isPopupOpen ? 'scrolling-fixed' : 'scrolling'}>
            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                {close => (
                    <div>
                        <a className="close" onClick={close}>
                            &times;
                        </a>
                        <h1>Все поля должны быть заполнены</h1>
                        <Button className='popup-button-error justify-content-center' variant='custom' onClick={close}>
                            <div className="buttonText">Хорошо</div>
                        </Button>
                    </div>
                )}
            </Popup>
            <div className="align-items-center justify-content-center">
                <div className="d-flex vertical-center-2 flex-row justify-content-between navCustom">
                    <a className="p-3 navCustomTitleActive">Расскажи о себе</a>
                    <a className="p-3 navCustomTitleActive">1/6</a>
                </div>
                <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>

                    <h4 className="CustomTitle">Имя</h4>
                    <Form.Control className='inputCustom fix-keybord' type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Введите имя" autoComplete="off" />
                    <h4 className="CustomTitle">Дата рождения</h4>
                    <div className='justify-content-between customD-flex'>
                        <Calendar />
                    </div>
                    <h4 className="CustomTitle">Пол</h4>
                    <GetToggleButton />
                    <br />
                    <h4 className="CustomTitle">Место жительства</h4>
                    <Form.Select className='inputCustom fix-keybord' name="country_filter" aria-label="Default select example" onChange={handleCountryChange}>
                        <option className='inputCustom fix-keybord' value="">Страна</option>
                        <option className='inputCustom fix-keybord' value="Россия">Россия</option>
                        <option className='inputCustom fix-keybord' value="Казахстан">Казахстан</option>
                        <option className='inputCustom fix-keybord' value="Армения">Армения</option>
                        <option className='inputCustom fix-keybord' value="Азербайджан">Азербайджан</option>
                        <option className='inputCustom fix-keybord' value="Беларусь">Беларусь</option>
                        <option className='inputCustom fix-keybord' value="Кыргызстан">Кыргызстан</option>
                        <option className='inputCustom fix-keybord' value="Молдова">Молдова</option>
                        <option className='inputCustom fix-keybord' value="Таджикистан">Таджикистан</option>
                        <option className='inputCustom fix-keybord' value="Узбекистан">Узбекистан</option>
                    </Form.Select>
                    <Form.Select className='inputCustom fix-keybord' name="city_filter" aria-label="Default select example" onChange={handleCityChange}>
                        <option className='inputCustom fix-keybord' value="">Город</option>
                        {cities.map((city) => (
                            <option className='inputCustom fix-keybord' key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </Form.Select>
                    <Button className="NextButtonCustom fix-keybord-button" type="submit">
                        <div className="NextButtonTextCustom">Далее</div>
                    </Button>
                </Form>
            </div>
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
