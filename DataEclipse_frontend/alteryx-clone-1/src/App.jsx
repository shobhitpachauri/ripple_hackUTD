import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './SCREENS/Main.jsx';
import FileUpload from './SCREENS/FileUpload.jsx';
import VariableAnalysis from './SCREENS/VariableAnalysis.jsx';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} /> 
          <Route path="/fileUpload" element={<FileUpload />} />
          <Route path="/analysis" element={<VariableAnalysis />} />
        </Routes>
      </Router>
  );
}

export default App;
