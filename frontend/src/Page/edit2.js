import React, { Component, useEffect, useState } from 'react';
import { Button, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

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

const DataComponent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    }

    useEffect(() => {
        axios.get('http://api.aura-ai.site/profile/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

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

        const formData = new FormData(form);
        formData.append('interests_array', JSON.stringify(selectedInterests));

        try {
            const response = await axios.put('http://api.aura-ai.site/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Handle the server response
        } catch (error) {
            // Handle any errors
            console.error(error);
        }
        setValidated(false);
        window.location.href = '/edit';
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
        <div>
            {data.map(item => (
                <div key={item.id}>
                    <div className="align-items-center justify-content-center">
                        <div className="d-flex vertical-center-2 flex-row justify-content-start navCustom">
                            <Button onClick={() => navigate(-1)} className='arrow' variant='custom'>
                                <img className="mainSVG" src={"arrow-left.svg"} alt="options" />
                            </Button>
                            <a className="p-3 navCustomTitle">Редактировать</a>
                        </div>
                        <Form className='bodyCustom' noValidate validated={validated} onSubmit={handleSubmit}>
                            <Button_checkbox
                                checkboxs={checkboxs}
                                selectedInterests={selectedInterests}
                                setSelectedInterests={setSelectedInterests}
                            />
                            <br />
                            <Button className="mainButton" type='sumbit'>
                                <div className="buttonText">Сохранить</div>
                            </Button>
                        </Form>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DataComponent;
