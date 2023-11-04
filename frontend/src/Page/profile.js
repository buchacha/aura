import React, { Component, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import axios from 'axios';
import * as amplitude from "@amplitude/analytics-browser";

import { Link } from 'react-router-dom'
import { parseISO, format } from "date-fns";


function calculateAge(birthDate, otherDate) {
    if (birthDate && otherDate) {
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
    return 0;
}

const handleLogout = () => {
  localStorage.removeItem('authTokens');
  window.location.replace('/login'); // Перенаправьте пользователя на страницу входа
};

const DataComponent = () => {

    const [data, setData] = useState({ profiles: [], authenticated_user_photo: null });

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    } else {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }

    useEffect(() => {
        axios.get('http://api.aura-ai.site/api/users/profile/')
            .then(response => {
                setData({ profiles: response.data.profiles, authenticated_user_photo: response.data.authenticated_user_photo });
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const newdate = `${formattedDay}/${formattedMonth}/${year}`;

    const interests = [
        { name: 'Природа', value: 'Природа', photo: 'flower_icon2.svg' },
        { name: 'Спорт', value: 'Спорт', photo: 'basketball_icon2.svg' },
        { name: 'Путешествие', value: 'Путешествие', photo: 'travel_icon2.svg' },
        { name: 'Книги', value: 'Книги', photo: 'book_icon2.svg' },
        { name: 'Питомцы', value: 'Питомцы', photo: 'cat_icon2.svg' },
        { name: 'Готовка', value: 'Готовка', photo: 'pizza_icon2.svg' },
        { name: 'Кино', value: 'Кино', photo: 'movie_icon2.svg' },
        { name: 'Юмор', value: 'Юмор', photo: 'humor_icon2.svg' },
        { name: 'Походы', value: 'Походы', photo: 'hikes_icon2.svg' },
        { name: 'Фотография', value: 'Фотография', photo: 'photography_icon2.svg' },
        { name: 'Искусство', value: 'Искусство', photo: 'art_icon2.svg' },
        { name: 'Бары', value: 'Бары', photo: 'bars_icon2.svg' },
        { name: 'Ужасы', value: 'Ужасы', photo: 'horror_icon2.svg' },
        { name: 'Музыка', value: 'Музыка', photo: 'musics_icon2.svg' },
        { name: 'Машины', value: 'Машины', photo: 'cars_icon2.svg' },
        { name: 'Мотоциклы', value: 'Мотоциклы', photo: 'motorcycles_icon2.svg' },
    ];

    return (
        <div>
            <div className="align-items-center justify-content-center">
                <div className="d-flex vertical-center-2 flex-row justify-content-start navCustom">
                    <Link reloadDocument to={'/card'}>
                        <Button className='arrow' variant='custom'>
                            <img className="mainSVG" src={"arrow-left.svg"} alt="options" />
                        </Button>
                    </Link>
                    <a className="p-3 navCustomTitle">Профиль</a>
                </div>
                <div className='d-flex align-items-center justify-content-center'>
                    <div className="profileAvatar">
                        {data && data.authenticated_user_photo && <img src={data.authenticated_user_photo} id="photo" alt="avatar" />}
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-center'>
                    <h1 className='navCustomTitle2'>{data.profiles.name}</h1>
                </div>
                <div className='p-4 d-flex align-items-center justify-content-between'>
                    <Link reloadDocument to={'/edit'}>
                        <Button className='noBorder' variant='custom'>
                            <img src={"edit_button.svg"} alt="avatar" ></img>
                            <h3>Редактировать</h3>
                        </Button>
                    </Link>
                    <Link to={'/filter'}>
                        <Button className='noBorder' variant='custom'>
                            <img src={"filter_button.svg"} alt="avatar" ></img>
                            <h3>Фильтры</h3>
                        </Button>
                    </Link>
                </div>
                <div className='d-flex align-items-center justify-content-center'>
                    <Link reloadDocument to={'/premium'} onClick={() => {
                        amplitude.track("My Premium Pressed");
                    }}>
                        <Button className='noBorder' variant='custom'>
                            <div className='d-flex align-items-center justify-content-center premium-block-text '>
                                <h3>получите бесплатный пробный <br /> доступ на 7 дней</h3>
                            </div>
                            <img src={"premium.svg"} alt="avatar" ></img>
                        </Button>
                    </Link>
                </div>
                <div className='bodyCustom'>
                    <h2 className="otherTitle">Возраст</h2>
                    <h3 className="mainText">{calculateAge(data.profiles.age, newdate)}</h3>


                    <h2 className="otherTitle">Страна</h2>
                    <h3 className="mainText">{data.profiles.country}</h3>


                    <h2 className="otherTitle">Город</h2>
                    <h3 className="mainText">{data.profiles.city}</h3>


                    <h2 className="otherTitle">Интересы</h2>
                    {data.profiles && data.profiles.interests_array && data.profiles.interests_array.length > 0 && (
                        <div>
                            {interests.map((interest, index) => {
                                if (data.profiles.interests_array.includes(interest.value)) {
                                    return (
                                        <div key={index} className='p-1 interestButton border-0 bg-transparent'>
                                            <img src={interest.photo} alt="sign" className="interestIcon" />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                    <Button
                        className='noBorder'
                        variant='custom'
                        onClick={handleLogout}
                        style={{
                            marginTop: '5%',
                            backgroundColor: 'red',
                            color: 'white',
                            border: '1px solid #ccc',
                            paddingTop: '4%',
                            borderRadius: '20px',
                            display: 'flex', // устанавливаем отображение в виде блока
                            alignItems: 'center', // выравниваем по вертикали
                            justifyContent: 'center', // выравниваем по горизонтали
                            width: '100%',
                        }}
                    >
                        <h3
                            style={{
                                color: 'white',
                                paddingTop: '3wh',
                                display : 'flex',
                                alignItems : 'center',
                                justifyContent : 'center',
                            }}
                        >
                            Выйти
                        </h3>
                    </Button>
                    <div className='bodyCustom marjin-top 10px'>
                        {/* Ваша существующая информация о профиле здесь... */}

                        <Container fluid>
                            <Row className="justify-content-center">
                                <Col md={6}>
                                    <h2 className="otherTitle text-center">Поддержка</h2>
                                    <p className="mainText text-center"><a href={'mailto:support@aura-ai.site'}>support@aura-ai.site</a></p>
                                    <p className="mainText text-center"><a href={'https://vk.com/auradating'} target="_blank" rel="noopener noreferrer">https://vk.com/auradating</a></p>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataComponent;
