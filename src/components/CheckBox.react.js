import React from 'react';
import { Form } from 'react-bootstrap';

const CheckBox = ({ isChecked, setIsChecked }) => {
    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <Form>
            <Form.Check
                type="checkbox"
                id="myCheckbox"
                label="Check to Use Preloaded Data"
                checked={isChecked}
                onChange={handleChange}
            />
        </Form>
    );
}

export default CheckBox;