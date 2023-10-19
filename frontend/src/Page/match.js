import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const DataComponent = () => {
    const navigate = useNavigate();

    const urlImg = "/match_bg.svg"

    const imgSyle = {
        backgroundImage: 'url(' + urlImg + ')',
    }

    return (
        <div className='p-3 premiumPage align-items-center justify-content-center' style={imgSyle}>
            <div className='d-flex justify-content-center'>
                <h1 className='matchText'>Мэтч!</h1>
            </div>
            <div className='matchBody d-flex justify-content-between'>
                <div className='leftMatch'>
                    <img src="pause_button.svg" alt="Avatar_1" />
                </div>
                <div className='rightMatch'>
                    <img src="play_button.svg" alt="Avatar_2" />
                </div>
            </div>
            <Link reloadDocument to={'/match'}>
                <Button className='mainButton justify-content-center' variant='custom'>
                    <div className="buttonText">Начать общение</div>
                </Button>
            </Link>
            <br />
            <Link reloadDocument to={'/card'}>
                <Button className='trialButton justify-content-center' variant='custom'>
                    <div className="buttonText">Продолжить поиск</div>
                </Button>
            </Link>
        </div>
    );
};

export default DataComponent;
