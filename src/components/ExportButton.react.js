import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from "react-bootstrap";
import "../styles/button.css";

const ExportButton = ({ data }) => {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, "investment_properties_with_specs.xlsx");
  };

  return (
    <Button onClick={handleExport} className="button">Export to Excel</Button>
  );
};

export default ExportButton;