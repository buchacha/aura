import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import "../Component/common.css";

import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import * as amplitude from "@amplitude/analytics-browser";

const Component = () => {
  useEffect(() => {
        amplitude.track('Auth Login Opened');
    }, []);

  const [errorMessage, setErrorMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [userData, setUserData] = useState({ authenticated_user: null, });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
      const response = await axios.get(`http://api.aura-ai.site/api/user/check/`);
      setUserData({
        authenticated_user: response.data.authenticated_user,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const response = await fetch(`http://api.aura-ai.site/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    })
    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem('authTokens', JSON.stringify(data))
      fetchData();

      amplitude.setUserId(formData.email);

      const identifyEvent = new amplitude.Identify();
      identifyEvent.set('status', 'authorized');
      amplitude.identify(identifyEvent);

      amplitude.track('Auth Login Succed');

      if (userData.authenticated_user && userData.authenticated_user.is_profile_complete) {
        navigate('/card');
      } else {
        navigate('/form');
      }
    } else {
      setErrorMessage("Не правильная почта или пароль")
    }
  };

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
    <div className="align-items-center justify-content-center">
      <div className="d-flex vertical-center-2 flex-row navCustom">
        <a className="p-3 navCustomTitleDisable" href="/singup">Регистрация</a>
        <a className="p-3 navCustomTitleActive">Вход</a>
      </div>

      <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Control required className="inputCustom fix-keybord" type="email" name="email" placeholder="Почта" autoComplete="off" value={formData.email} onChange={handleChange} />
        <div className='passwordContainer fix-keybord'>
          <Form.Control required className="inputCustom fix-keybord" type="password" name="password" id="password" placeholder="Пароль" autoComplete="off" value={formData.password} onChange={handleChange} />
          <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} id="togglePassword" onClick={handleTogglePassword}></i>
        </div>
        <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>

        <Button className="NextButtonCustom fix-keybord-button" type="submit">
          <div className="NextButtonTextCustom">Далее</div>
        </Button>
      </Form>
    </div>
  );
};

export default Component;
