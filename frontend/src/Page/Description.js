import React, { useEffect, useState } from 'react';
import "../Component/description.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as amplitude from "@amplitude/analytics-browser";

function GetDescription() {
    const carouselItems = [
        {
            mainSvg: 'main_1.svg',
            mainTitle: 'Идеальный мэтч',
            dotsSvg: 'dots_1.svg',
            mainText: 'Найди идеального партнера на основе анализа искусственным интеллектом',
        },
        {
            mainSvg: 'main_2.svg',
            mainTitle: 'Раскрой себя',
            dotsSvg: 'dots_2.svg',
            mainText: 'Алгоритм проанализирует твой голос и раскроет индивидуальные особенности личности',
        },
        {
            mainSvg: 'main_3.svg',
            mainTitle: 'Гармоничный союз',
            dotsSvg: 'dots_3.svg',
            mainText: 'Построй долгосрочные отношения благодаря максимальной гармонии с партнером',
        },
    ];

    const navigate = useNavigate(); // Get the history object

    useEffect(() => {
        // Check if there is a token (you can replace this with your actual token check logic)
        const hasToken = localStorage.getItem('authTokens'); // Assuming you store the token in localStorage

        if (hasToken) {
            // Redirect to the "/card" route
            navigate('/card');
        }

        amplitude.track('Hello Opened');
    }, [navigate]);



    const handleButtonClick = () => {
        amplitude.track('Hello Next Pressed');
        window.location.href = '/singup';
    };

    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
        const updateKeyboardOffset = () => {
            const windowHeight = window.innerHeight;
            const bodyHeight = document.body.clientHeight;
            const offset = bodyHeight - windowHeight;
            setKeyboardOffset(offset);
        };

        window.addEventListener('resize', updateKeyboardOffset);
        return () => {
            window.removeEventListener('resize', updateKeyboardOffset);
        };
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--keyboard-vh', `${window.innerHeight - keyboardOffset}px`);
    }, [keyboardOffset]);

    return (
        <div className="mainPage">
            <div className="text-center">
                <h1 className="mainLogo">AURA</h1>
            </div>
            <div className="mainBody">
                <div className="mainFrame">
                    <Carousel className='fillDiv'>
                        {carouselItems.map((item, index) => (
                            <Carousel.Item key={index}>
                                <div className='divSVG d-flex align-items-center justify-content-center'>
                                    <img className="mainSVG d-flex align-items-center justify-content-center" src={item.mainSvg} alt="dots icon" />
                                </div>
                                <h2 className="mainTitle">{item.mainTitle}</h2>
                                <img className="dotsSVG" src={item.dotsSvg} alt="dots icon" />
                                <h3 className="mainText">{item.mainText}</h3>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div>
                    <Button className="mainButton" onClick={handleButtonClick}>
                        <div className="buttonText">Далее</div>
                    </Button>
                    <a href="/login" className="mainLink">
                        <div>У меня уже есть аккаунт</div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default GetDescription;
