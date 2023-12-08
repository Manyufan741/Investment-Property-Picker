import './App.css';

import React from 'react';
import FileUploader from './components/FileUploader.react.js';
import {Container} from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container fluid>
      <h1>Customizable Investment Property Selection</h1>
      <FileUploader />
    </Container>
    </div>
  );
}

export default App;