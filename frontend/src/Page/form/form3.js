import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';
import Home from '../../Page/home.js';

import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import * as amplitude from "@amplitude/analytics-browser";

const Form_post = ({ data }) => {

  const navigate = useNavigate();

  React.useEffect(() => {
    if (
      data.authenticated_user.photo
    ) {
      navigate('/form4');
    }
    const identifyEvent = new amplitude.Identify();
    identifyEvent.set('status', 'authorized');
    identifyEvent.set('sex', data.authenticated_user.sex);
    identifyEvent.set('age', data.authenticated_user.age);
    identifyEvent.set('country', data.authenticated_user.country);
    identifyEvent.set('city', data.authenticated_user.city);
    amplitude.identify(identifyEvent);

    amplitude.setUserId(data.authenticated_user_email);

    amplitude.track('Onboard Photo Opened');
  }, []);

  const [validated, setValidated] = useState(false);
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const resizeImage = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
        setImage(uri);
      }, 'base64');
  });

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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

    if (form.checkValidity()) {
      const formData = new FormData(form);

      if (!formData.get('photo').name) {
        setShowPopup(true)
      } else {
        setShowPopup(false)


        const resizedImage = await resizeImage(formData.get('photo'));
        const file = dataURItoBlob(resizedImage);
        formData.set('photo', file, 'resized-photo.jpg');

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
          navigate('/form4')
        } else {
          alert('Ошибка!!!');
        }
      }
    }
  }

  const onImageChange = async (event) => {
    const file = event.target.files[0];
    const resizedImage = await resizeImage(file);
    setImage(resizedImage);
  };

  const urlImg = "/photo_icon.svg"

  const imgSyle = {
    backgroundImage: 'url(' + urlImg + ')',
  }

  return (
    <div>
      <Popup open={showPopup} onClose={() => setShowPopup(false)}>
        {close => (
          <div>
            <a className="close" onClick={close}>
              &times;
            </a>
            <h1>Пожалуйста, выберите фото</h1>
            <Button className='popup-button-error justify-content-center' variant='custom' onClick={close}>
              <div className="buttonText">Хорошо</div>
            </Button>
          </div>
        )}
      </Popup>
      <div className="align-items-center justify-content-center">
        <div className="d-flex vertical-center-2 flex-row justify-content-between navCustom">
          <a className="p-3 navCustomTitleActive">Загрузи фото</a>
          <a className="p-3 navCustomTitleActive">3/6</a>
        </div>
        <Form className="bodyCustom" noValidate validated={validated} onSubmit={handleSubmit}>
          <h4 className="CustomTitle">Загрузи своё лучшее фото</h4>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              className="formControlImg"
              type="file"
              id="photo"
              onChange={onImageChange}
              name="photo"
              accept=".png, .jpg, .jpeg"
            />
          </Form.Group>
          <div className="photoFrame">
            <Image style={imgSyle} src={image} rounded />
          </div>
          <Button className="mainButton" onClick={() => document.getElementById('photo').click()}>
            <div className="buttonText">Загрузить</div>
          </Button>
          <Button className="NextButtonCustom" type="submit">
            <div className="NextButtonTextCustom">Далее</div>
          </Button>
        </Form>
      </div>
    </div>
  );
}

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
