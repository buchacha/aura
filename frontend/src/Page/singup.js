import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../Component/common.css"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as amplitude from "@amplitude/analytics-browser";

const Component = () => {
    useEffect(() => {
        amplitude.track('Auth Signup Opened');
    }, []);

    const [errorMessage, setErrorMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const responseData = await response.json();
            if (responseData.message) {
                setValidated(false);
                setErrorMessage(responseData.message);
            } else {
                const responseToken = await fetch(`${process.env.REACT_APP_API_URL}/api/token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const tokenData = await responseToken.json();
                localStorage.setItem('authTokens', JSON.stringify(tokenData));

                amplitude.setUserId(formData.email);

                const identifyEvent = new amplitude.Identify();
                identifyEvent.set('status', 'authorized');
                amplitude.identify(identifyEvent);

                amplitude.track('Auth Signup Succed');

                navigate('/form');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const password = document.querySelector('#password');
        password.setAttribute('type', showPassword ? 'text' : 'password');
    }, [showPassword]);

    return (
        <div className="align-items-center">
            <div className="d-flex vertical-center-2 flex-row navCustom">
                <a className="p-3 navCustomTitleActive">Регистрация</a>
                <a className="p-3 navCustomTitleDisable" href="/login">Вход</a>
            </div>

            <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Control required className="inputCustom fix-keybord" type="email" name="email" id="email" placeholder="Почта" autoComplete="off" value={formData.email} onChange={handleChange} />


                <div className='passwordContainer fix-keybord'>
                    <Form.Control required className="inputCustom fix-keybord" type="password" name="password" id="password" placeholder="Пароль" autoComplete="off" value={formData.password} onChange={handleChange} />
                    <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} id="togglePassword" onClick={handleTogglePassword}></i>
                </div>
                <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>

                <Button className="NextButtonCustom fix-keybord-button" type="submit">
                    <div className="NextButtonTextCustom">Далее</div>
                </Button>
            </Form>

            <div className="footerText mt-4" style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                left: '0',
                margin: '3%',
                textAlign: 'center',
            }}>
                Продолжая использование, Вы соглашаетесь с{' '}
                <a href="https://vk.com/topic-223127554_49333014" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>
                {' '}и{' '}
                <a href="https://vk.com/topic-223127554_49333017" target="_blank" rel="noopener noreferrer">условиями использования сервиса</a>
                .
            </div>
        </div>
    );
}

export default Component;
