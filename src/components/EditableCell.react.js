import React, { useState, useEffect } from 'react';

const EditableCell = ({ value, onValueChange }) => {
  const [editableValue, setEditableValue] = useState(value);

  useEffect(() => {
    setEditableValue(value);
  }, [value]);

  const handleChange = (e) => {
    setEditableValue(e.target.value);
  };

  const handleBlur = () => {
    onValueChange(parseFloat(editableValue) || 0);
  };

  return (
    <input
      type="number"
      value={editableValue}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{ width: "100%" }}
    />
  );
};

export default EditableCell;