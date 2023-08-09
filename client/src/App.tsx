import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navbar from './assets/components/Navbar';
import { TableView } from './assets/components/table';
import InputForm from './assets/components/Input';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TableView/>} />
        <Route path="/input" element={<InputForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
