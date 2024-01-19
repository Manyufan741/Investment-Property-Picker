import React from 'react';
import { Form } from 'react-bootstrap';
import "../styles/finSpec.css";

const CheckBox = ({ isChecked, setIsChecked }) => {
    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <Form>
            <Form.Check className="checkbox"
                type="checkbox"
                id="myCheckbox"
                label="使用已儲存的資料"
                checked={isChecked}
                onChange={handleChange}
            />
        </Form>
    );
}

export default CheckBox;