import React, { Component }  from 'react';
import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

function GetToggleButton() {
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'Men', value: 'Муж.', photo: ["male_button_1.svg", "male_button_2.svg" ]},
        { name: 'Female', value: 'Жен.', photo: ["female_button_1.svg", "female_button_2.svg"]},
    ];

    return (
        <>
            <ButtonGroup className='customD-flex d-flex justify-content-between'>
                {radios.map((radio, idx) => (
                    <ToggleButton className="sexButton border-0 bg-transparent"
                        required
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        name="sex"
                        variant="outline-light"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                        <img src={radio.photo[radioValue === radio.value ? 1 : 0]} alt="sign" className='sexButtonImg'/>
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </>
    );
}

export default GetToggleButton;