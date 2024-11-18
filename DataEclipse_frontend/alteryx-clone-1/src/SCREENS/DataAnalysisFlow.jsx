import React, { useState } from 'react';
import { Upload, X, FileText, BarChart2, Calendar, Hash, List, ChevronRight, Info } from 'lucide-react';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="loading-screen">
    <h2>Loading...</h2>
  </div>
);

// Variable Details Component
const VariableDetails = ({ variable }) => (
  <div className="variable-details">
    <h3>{variable.name}</h3>
    <p>Type: {variable.type}</p>
    <p>Valid: {variable.stats.valid}</p>
    <p>Missing: {variable.stats.missing}</p>
    <p>Mismatched: {variable.stats.mismatched}</p>
    <p>Min: {variable.stats.min}</p>
    <p>Max: {variable.stats.max}</p>
    <p>Mean: {variable.stats.mean}</p>
    {/* You can render a graph or distribution here as needed */}
  </div>
);

// Variables Description Page Component
const VariableDescriptionPage = ({ analysisResults }) => {
  const [selectedVariable, setSelectedVariable] = useState(null);

  const handleVariableClick = (variable) => {
    setSelectedVariable(variable);
  };

  const { variables } = analysisResults;

  const renderVariableSection = (title, icon, variables, colorClass) => (
    <section className={`variable-section ${colorClass}`}>
      <h2>
        {icon} {title}
      </h2>
      <div className="variables-list">
        {variables.map((variable, index) => (
          <div key={index} className="variable-card" onClick={() => handleVariableClick(variable)}>
            <h4>{variable.name}</h4>
            <p>{variable.type}</p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="variable-description-page">
      <h1>Variable Descriptions</h1>
      <div>
        {renderVariableSection(
          'Integer Variables',
          <BarChart2 />,
          variables.integer,
          'integer-section'
        )}
        {renderVariableSection(
          'Categorical Variables',
          <List />,
          variables.categorical,
          'categorical-section'
        )}
        {renderVariableSection(
          'Date Variables',
          <Calendar />,
          variables.date,
          'date-section'
        )}
      </div>

      {selectedVariable && <VariableDetails variable={selectedVariable} />}
    </div>
  );
};

// Main Data Analysis Flow Component
const DataAnalysisFlow = () => {
  const [currentPage, setCurrentPage] = useState('upload');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState(null);
  const [businessGoal, setBusinessGoal] = useState('');
  const fileRef = React.useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleAnalyze = () => {
    if (!file || !businessGoal.trim()) return;
    setIsAnalyzing(true);

    // Simulate backend processing
    const mockResults = generateMockAnalysisResults(file.name, businessGoal);
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
    setCurrentPage('variables');
  };

  const generateMockAnalysisResults = (fileName, businessGoal) => ({
    businessGoal,
    fileName,
    variables: {
      integer: [
        {
          name: 'Var1',
          type: 'Integer',
          stats: {
            valid: 350,
            missing: 0,
            mismatched: 0,
            min: 100,
            max: 5000,
            mean: 2550,
            distribution: [0.3, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4]
          }
        }
      ],
      categorical: [
        {
          name: 'Cat Varr1',
          type: 'Categorical',
          stats: {
            valid: 350,
            missing: 0,
            mismatched: 0,
            distribution: [0.4, 0.3, 0.3]
          }
        }
      ],
      date: [
        {
          name: 'Date Varr8',
          type: 'Date',
          stats: {
            valid: 350,
            missing: 0,
            mismatched: 0,
            min: '2012-03-01',
            max: '2017-12-25',
            distribution: [0.2, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8]
          }
        }
      ]
    }
  });

  return (
    <div className="data-analysis-flow">
      {currentPage === 'upload' && (
        <div className="upload-page">
          <h2>Upload Your Data File</h2>
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileUpload}
          />
          <input
            type="text"
            value={businessGoal}
            onChange={(e) => setBusinessGoal(e.target.value)}
            placeholder="Enter your business goal"
          />
          <button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      )}

      {currentPage === 'variables' && analysisResults && (
        <VariableDescriptionPage analysisResults={analysisResults} />
      )}

      {isAnalyzing && <LoadingScreen />}
    </div>
  );
};

export default DataAnalysisFlow;
