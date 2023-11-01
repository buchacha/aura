import React, { Component, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import ru from 'date-fns/locale/ru';
import Home from './home.js';

const EditComponent = ({ data, date }) => {

    const [startDate, setStartDate] = useState(new Date(date.split('/').reverse().join('-')));

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
            <DatePicker onFocus={(e) => e.target.blur()} className='inputCustom fix-keybord' required id="age" name="age" autoComplete="off" placeholderText={"ДД/ММ/ГГГГ"}
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

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    const [image, setImage] = useState();

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    } else {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }

    const handleCityChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
    };

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

    const [selectedCountry, setSelectedCountry] = useState(data.profiles.country);
    const [selectedCity, setSelectedCity] = useState(data.profiles.city);
    const [cities, setCities] = useState(citiesByCountry[selectedCountry] || []);
    const [validated, setValidated] = useState(false);

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
        // Set cities based on the selected country
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
        const selectedCities = citiesByCountry[selectedCountry] || [];
        setCities(selectedCities);
        setSelectedCity('');
    };

    function calculateAge(birthDate, otherDate) {
        birthDate = new Date(
            birthDate.split("/").reverse().join("-")
        );
        otherDate = new Date(
            otherDate.split("/").reverse().join("-")
        );

        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);

        var years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (
            otherDate.getMonth() < birthDate.getMonth() ||
            (otherDate.getMonth() === birthDate.getMonth() &&
                otherDate.getDate() < birthDate.getDate())
        ) {
            years--;
        }

        return years;
    }

    const handleChange = (event) => {
        let string = event.target.value;
        if (string && !string.startsWith("@")) {
            event.target.value = "@" + event.target.value
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        const formData = new FormData(form);

        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();

        const newdate = day + "/" + month + "/" + year;

        formData.append('age_year', JSON.stringify(calculateAge(startDate.toLocaleDateString('en-GB').split(',')[0], newdate)));

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Handle the server response
            console.log(response.data);
        } catch (error) {
            // Handle any errors
            console.error(error);
        }
        setValidated(false);
        window.location.href = '/profile';
    };


    return (
        <div>
            <div className="align-items-center justify-content-center">
                <div className="d-flex vertical-center-2 flex-row justify-content-start navCustom">
                    <Button onClick={() => navigate('/profile')} className='arrow' variant='custom'>
                        <img className="mainSVG" src={"arrow-left.svg"} alt="options" />
                    </Button>
                    <a className="p-3 navCustomTitle">Редактировать</a>
                </div>
                <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className='d-flex align-items-center justify-content-center'>
                        <Form.Control className='formControlImg' type="file" id="photo" onChange={onImageChange} name="photo" accept=".png, .jpg, .jpeg" />
                        <Button className="noBorder" variant='custom' onClick={() => document.getElementById('photo').click()}>
                            <div className="profileAvatar">
                                <img className='defaultPhoto' src={data.authenticated_user_photo}></img>
                                <img className='newPhoto' src={image} onChange={onImageChange}></img>
                                <div className="change" />
                                <img className='editVector' src={"edit_vector.svg"}></img>
                            </div>
                        </Button>
                    </div>
                    <h4 className="CustomTitle">Имя</h4>
                    <Form.Control className='inputCustom fix-keybord' required type="text" name="name" placeholder="Введите имя" autoComplete="off" defaultValue={data.profiles.name} />
                    <h4 className="CustomTitle">Дата рождения</h4>
                    <div className='justify-content-between customD-flex'>
                        <Calendar />
                    </div>
                    <h4 className="CustomTitle">Место жительства</h4>
                    <Form.Select className='inputCustom fix-keybord' name="country" aria-label="Default select example" onChange={handleCountryChange} defaultValue={data.profiles.country}>
                        <option className='inputCustom fix-keybord' value="default" disabled selected hidden>
                            {data.profiles.country}
                        </option>
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

                    <Form.Select className='inputCustom fix-keybord' name="city" aria-label="Default select example" value={selectedCity} onChange={handleCityChange} defaultValue={data.profiles.city}>
                        <option className='inputCustom fix-keybord' value="default" disabled selected hidden>
                            {data.profiles.city}
                        </option>
                        {cities.map((city) => (
                            <option className='inputCustom fix-keybord' key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </Form.Select>
                    <h4 className="CustomTitle">Интересы</h4>
                    {/* <Link reloadDocument to={'/edit2'} > */}
                    <Form.Control className='inputCustom fix-keybord' type="text" name="name" placeholder="Интересы" autoComplete="off" form="no-form" onClick={() => navigate('/edit-interests')}/>
                    {/* </Link> */}
                    <h4 className="CustomTitle">Контакты</h4>
                    <Form.Control className='inputCustom fix-keybord' type="text" name="social_media_vk" placeholder="ВКонтакте: @username" autoComplete="off" defaultValue={data.profiles.social_media_vk} onChange={handleChange} />
                    <Form.Control className='inputCustom fix-keybord' type="text" name="social_media_tg" placeholder="Телеграм: @username" autoComplete="off" defaultValue={data.profiles.social_media_tg} onChange={handleChange} />
                    <Form.Control className='inputCustom fix-keybord' type="text" name="social_media_wa" placeholder="Вацап: @79XXXXXXXXX" autoComplete="off" defaultValue={data.profiles.social_media_wa} onChange={handleChange} />
                    {/* <Form.Control className='inputCustom fix-keybord' type="text" name="social_media_ok" placeholder="Одноклассники" autoComplete="off" defaultValue={data.profiles.social_media_ok} onChange={handleChange}/> */}
                    <Form.Control className='inputCustom fix-keybord' type="text" name="social_media_ig" placeholder="Инстаграм*: @username" autoComplete="off" defaultValue={data.profiles.social_media_ig} onChange={handleChange} />
                    <p className='alert'>Инстаграм*, признан экстремистской организацией в России</p>
                    <Button className="mainButton fix-keybord-button" type='sumbit'>
                        <div className="buttonText">Сохранить</div>
                    </Button>
                </Form>
            </div>
        </div>
    );
};

function DataComponent(props) {
    const [startDateString, setStartDateString] = useState({ date: null });
    const [data, setData] = useState({ profiles: [], authenticated_user_photo: null });

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    } else {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile/`)
            .then(response => {
                setData({ profiles: response.data.profiles, authenticated_user_photo: response.data.authenticated_user_photo });
                setStartDateString({ date: response.data.profiles.age });
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
                <EditComponent data={data} date={startDateString.date} />
            )}
        </>
    );

};

export default DataComponent;
