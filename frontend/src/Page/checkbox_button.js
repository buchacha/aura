import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

function ToggleButtonExample() {
    const [checkboxValues, setCheckboxValues] = useState([]);

    const checkboxs = [
        { name: 'Nature', value: 'Природа', photo: ["flower_icon.svg", "flower_icon2.svg"]},
        { name: 'Sport', value: 'Спорт', photo: ["basketball_icon.svg", "basketball_icon2.svg"]},
        { name: 'Travel', value: 'Путешествие', photo: ["travel_icon.svg", "travel_icon2.svg"]},
        { name: 'Books', value: 'Книги', photo: ["book_icon.svg", "book_icon2.svg"]},
        { name: 'Pets', value: 'Питомцы', photo: ["cat_icon.svg", "cat_icon2.svg"]},
        { name: 'Cooking', value: 'Готовка', photo: ["pizza_icon.svg", "pizza_icon2.svg"]},
    ];

    const handleCheckboxChange = (value) => {
        if (checkboxValues.includes(value)) {
            setCheckboxValues(checkboxValues.filter((val) => val !== value));
        } else {
            setCheckboxValues([...checkboxValues, value]);
        }
    };

    return (
        <>
            <ButtonGroup className='customD-flex customBlockDisplay'>
                {checkboxs.map((checkbox, idx) => (
                    <ToggleButton className="interestButton border-0 bg-transparent"
                        required
                        key={idx}
                        id={`checkbox-${idx}`}
                        type="checkbox"
                        name="sex"
                        variant="outline-light"
                        value={checkbox.value}
                        checked={checkboxValues.includes(checkbox.value)}
                        onChange={() => handleCheckboxChange(checkbox.value)}
                    >
                        <img src={checkbox.photo[checkboxValues.includes(checkbox.value) ? 1 : 0]} alt="sign" className='interestIcon'/>
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </>
    );
}

export default ToggleButtonExample;