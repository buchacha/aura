import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const DataComponent = () => {

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    }

    const navigate = useNavigate();

    const urlImg = "/premium_background.svg"

    const imgSyle = {
        backgroundImage: 'url(' + urlImg + ')',
    }

    return (
        <div className='p-3 premiumPage align-items-center justify-content-center' style={imgSyle}>
            <Button className='exit' onClick={() => navigate(-1)} variant='custom'>
                <img className="mainSVG" src={"exit_icon.svg"} alt="options" />
            </Button>
            <div className='premiumContainerTitle d-flex align-items-center justify-content-center'>
                <h1>Премиум аккаунт!</h1>
                <div className='premiumContainerText d-flex'>
                    <h2>•  Видеть, кому я понравился</h2>
                    <h2>•  Неограниченные лайки</h2>
                    <h2>•  Расширенная совместимость</h2>
                    <h2>•  Измеение параметров совместимости</h2>
                </div>
            </div>
            <br />
            <br />
            <br />
            <Link reloadDocument to={'/premium'}>
                <Button className='d-flex buyButton justify-content-center' variant='custom'>
                    <h1>Купить</h1>
                </Button>
            </Link>
            <br />
            <Link reloadDocument to={'/premium'}>
                <Button className='d-flex trialButton2 justify-content-center' variant='custom'>
                    <h2>Оформить пробный период</h2>
                </Button>
            </Link>
        </div>
    );
};

export default DataComponent;
