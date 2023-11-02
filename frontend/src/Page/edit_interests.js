import React, { useState, useEffect } from 'react';
import { Button, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from '../Page/home.js';

const Button_checkbox = ({ checkboxs, selectedInterests, setSelectedInterests }) => {
  const [checkboxValues, setCheckboxValues] = useState([]);

  const handleCheckboxChange = (event, name, value) => {
    if (event.target.checked) {
      setSelectedInterests([...selectedInterests, name]);
    } else {
      setSelectedInterests(selectedInterests.filter((interest) => interest !== name));
    }

    if (checkboxValues.includes(value)) {
      setCheckboxValues(checkboxValues.filter((val) => val !== value));
    } else {
      setCheckboxValues([...checkboxValues, value]);
    }
  };

  return (
    <ButtonGroup className="customD-flex customBlockDisplay">
      {checkboxs.map((checkbox) => (
        <ToggleButton
          className="interestButton border-0 bg-transparent"
          required
          type="checkbox"
          id={checkbox.name}
          name={checkbox.name}
          value={checkbox.value}
          checked={checkboxValues.includes(checkbox.value)}
          onChange={(event) => handleCheckboxChange(event, checkbox.name, checkbox.value)}
        >
          <img src={checkbox.photo[checkboxValues.includes(checkbox.value) ? 1 : 0]} alt="sign" className="interestIcon" />
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
};

const Form_post = ({ data }) => {

  const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (
  //     data.authenticated_user.interests_array
  //   ) {
  //     navigate('/form3');
  //   }
  // }, []);


  const [selectedInterests, setSelectedInterests] = useState([]);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData();
    formData.append('interests_array', JSON.stringify(selectedInterests));

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
      navigate('/edit')
    } else {
      alert('Ошибка!!!');
    }
  };

  const checkboxs = [
    { name: 'Природа', value: 'Природа', photo: ['flower_icon.svg', 'flower_icon2.svg'] },
    { name: 'Спорт', value: 'Спорт', photo: ['basketball_icon.svg', 'basketball_icon2.svg'] },
    { name: 'Путешествие', value: 'Путешествие', photo: ['travel_icon.svg', 'travel_icon2.svg'] },
    { name: 'Книги', value: 'Книги', photo: ['book_icon.svg', 'book_icon2.svg'] },
    { name: 'Питомцы', value: 'Питомцы', photo: ['cat_icon.svg', 'cat_icon2.svg'] },
    { name: 'Готовка', value: 'Готовка', photo: ['pizza_icon.svg', 'pizza_icon2.svg'] },
    { name: 'Кино', value: 'Кино', photo: ['movie_icon.svg', 'movie_icon2.svg'] },
    { name: 'Юмор', value: 'Юмор', photo: ['humor_icon.svg', 'humor_icon2.svg'] },
    { name: 'Походы', value: 'Походы', photo: ['hikes_icon.svg', 'hikes_icon2.svg'] },
    { name: 'Фотография', value: 'Фотография', photo: ['photography_icon.svg', 'photography_icon2.svg'] },
    { name: 'Искусство', value: 'Искусство', photo: ['art_icon.svg', 'art_icon2.svg'] },
    { name: 'Бары', value: 'Бары', photo: ['bars_icon.svg', 'bars_icon2.svg'] },
    { name: 'Ужасы', value: 'Ужасы', photo: ['horror_icon.svg', 'horror_icon2.svg'] },
    { name: 'Музыка', value: 'Музыка', photo: ['musics_icon.svg', 'musics_icon2.svg'] },
    { name: 'Машины', value: 'Машины', photo: ['cars_icon.svg', 'cars_icon2.svg'] },
    { name: 'Мотоциклы', value: 'Мотоциклы', photo: ['motorcycles_icon.svg', 'motorcycles_icon2.svg'] },
  ];

  return (
    <div className="align-items-center justify-content-center">
      <div className="d-flex vertical-center-2 flex-row justify-content-between navCustom">
        <a className="p-3 navCustomTitleActive">Выбери интересы</a>
      </div>
      <Form className="bodyCustom" noValidate validated={validated} onSubmit={handleSubmit}>
        <h4 className="CustomTitle">Интересы</h4>
        <Button_checkbox
          checkboxs={checkboxs}
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
        />
        <Button className="NextButtonCustom" type="submit">
          <div className="NextButtonTextCustom">Сохранить</div>
        </Button>
      </Form>
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
    axios.get(`${process.env.REACT_APP_API_URL}/api/user/check/`)
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
