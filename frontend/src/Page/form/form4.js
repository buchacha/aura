import React, { Component, useEffect } from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Home from '../../Page/home.js';

import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import * as amplitude from "@amplitude/analytics-browser";


const Form_post = ({ data }) => {

  const navigate = useNavigate();

  React.useEffect(() => {
    if (
      data.authenticated_user.social_media_vk ||
      data.authenticated_user.social_media_tg ||
      data.authenticated_user.social_media_wa ||
      data.authenticated_user.social_media_ok ||
      data.authenticated_user.social_media_ig
    ) {
      navigate('/form5');
    }
    const identifyEvent = new amplitude.Identify();
    identifyEvent.set('status', 'authorized');
    identifyEvent.set('sex', data.authenticated_user.sex);
    identifyEvent.set('age', data.authenticated_user.age);
    identifyEvent.set('country', data.authenticated_user.country);
    identifyEvent.set('city', data.authenticated_user.city);
    amplitude.identify(identifyEvent);

    amplitude.setUserId(data.authenticated_user_email);

    amplitude.track('Onboard Contacts Opened');
  }, []);

  const [validated, setValidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  let showPopupFlag = true

  const handleChange = (event) => {
    let string = event.target.value;
    if (string && !string.startsWith("@")) {
      event.target.value = "@" + event.target.value
    }
  }

  const handleSubmit = async (event) => {

    const form_valid = event.currentTarget;
    if (form_valid.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    setShowPopup(true);

    for (let [key, value] of formData.entries()) {
      if (key == "social_media_vk" && value.length > 1) {
        // formData.set(key, `https://vk.com/${value.slice(1)}`);
        showPopupFlag = false
      } else if (key == "social_media_tg" && value.length > 1) {
        // formData.set(key, `https://t.me/${value.slice(1)}`);
        showPopupFlag = false
      } else if (key == "social_media_wa" && value.length > 1) {
        // formData.set(key, `https://wa.me/${value.slice(1)}`);
        showPopupFlag = false
      } else if (key == "social_media_ig" && value.length > 1) {
        // formData.set(key, `https://instagram.com/${value.slice(1)}`);
        showPopupFlag = false
      }
    }

    if (showPopupFlag) {
      setShowPopup(true)
    } else {
      setShowPopup(false)

      const authTokens = localStorage.getItem('authTokens');

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
        navigate('/form5')
      } else {
        navigate('/login')
      }
    }
  };

  return (
    <div>
      <Popup open={showPopup} onClose={() => setShowPopup(false)}>
        {close => (
          <div>
            <a className="close" onClick={close}>
              &times;
            </a>
            <h1>Введите хотя бы одну соц. сеть</h1>
            <Button className='popup-button-error justify-content-center' variant='custom' onClick={close}>
              <div className="buttonText">Хорошо</div>
            </Button>
          </div>
        )}
      </Popup>
      <div className="align-items-center justify-content-center">
        <div className="d-flex vertical-center-2 flex-row justify-content-between navCustom">
          <a className="p-3 navCustomTitleActive">Укажи контакты</a>
          <a className="p-3 navCustomTitleActive">4/6</a>
        </div>
        <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>
          <h4 className="CustomTitle">Добавь ссылки которые станут доступны другим пользователям</h4>
          <h3 className="mainText">Они станут доступны другим пользователям только после взаимной симпатии</h3>
          <Form.Control className='inputCustom fix-keybord' required type="text" name="social_media_vk" placeholder="ВКонтакте: @username" autoComplete="off" defaultValue={""} onChange={handleChange} />
          <Form.Control className='inputCustom fix-keybord' required type="text" name="social_media_tg" placeholder="Телеграм: @username" autoComplete="off" defaultValue={""} onChange={handleChange} />
          <Form.Control className='inputCustom fix-keybord' required type="text" name="social_media_wa" placeholder="Вацап: @79XXXXXXXXX" autoComplete="off" defaultValue={""} onChange={handleChange} />
          {/* <Form.Control className='inputCustom fix-keybord' required type="text" name="social_media_ok" placeholder="Одноклассники" autoComplete="off" defaultValue={""} /> */}
          <Form.Control className='inputCustom fix-keybord' required type="text" name="social_media_ig" placeholder="Инстаграм*: @username" autoComplete="off" defaultValue={""} onChange={handleChange} />
          <p className='alert'>Инстаграм*, признан экстремистской организацией в России</p>
          <Button className="NextButtonCustom fix-keybord-button" type="submit">
            <div className="NextButtonTextCustom">Далее</div>
          </Button>
        </Form>
      </div>
    </div>
  );
};

function DataComponent() {
  const [data, setData] = useState({
    authenticated_user: null,
    authenticated_user_email: null,
  });

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
          authenticated_user: response.data.authenticated_user,
          authenticated_user_email: response.data.authenticated_user_email,
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
