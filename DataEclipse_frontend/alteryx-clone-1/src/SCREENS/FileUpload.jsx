import React, { useState, useRef } from 'react';
import { Upload, X, FileText, BarChart2 } from 'lucide-react';
import axios from 'axios';

const CSVUploader = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
}

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setFile(e.target.files[0]); // Update the state with the selected file
  }
};
const handleUpload = async () => {
  if (!file) {
    alert("Please select a file!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    // Replace with your Flask backend endpoint
    const response = await axios.post("http://localhost:5000/upload_to_pinata", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      const ipfsHash = response.data.ipfs_hash; // Assuming your Flask backend returns `ipfs_hash`
      setIpfsHash(ipfsHash);
      alert(`File uploaded successfully! IPFS Hash: ${ipfsHash}`);
    } else {
      alert("Failed to upload the file.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading the file. Please try again.");
  }
};
 
const LoadingScreen = () => (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="text-center">
<div className="ripple"></div>
<p className="mt-6 text-white text-xl font-semibold">Processing Data...</p>
<style jsx>{`
        .ripple {
          width: 20px;
          height: 20px;
          background: #F58025;
          border-radius: 50%;
          margin: 0 auto;
          animation: ripple 3s linear infinite;
        }
        @keyframes ripple {
          0% { box-shadow: 0 0 0 0 rgba(245, 128, 37, 0.3), 0 0 0 20px rgba(245, 128, 37, 0.3), 0 0 0 40px rgba(245, 128, 37, 0.3); }
          50% { box-shadow: 0 0 0 20px rgba(0, 105, 170, 0.3), 0 0 0 40px rgba(0, 105, 170, 0.3), 0 0 0 60px rgba(0, 105, 170, 0.3); }
          100% { box-shadow: 0 0 0 0 rgba(245, 128, 37, 0.3), 0 0 0 20px rgba(245, 128, 37, 0.3), 0 0 0 40px rgba(245, 128, 37, 0.3); }
        }
      `}</style>
</div>
</div>
);
 
const UploadPage = ({ onPageChange }) => {
  const [file, setFile] = useState(null);
  const [businessGoal, setBusinessGoal] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef(null);
 
  const handleAnalyze = async () => {
    if (!file || !businessGoal.trim()) return;
    setIsAnalyzing(true);
    // Mock analysis results
    const analysisResults = {
      businessGoal,
      fileName: file.name,
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
    };
    console.log(typeof handleUpload);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Store results in localStorage or your preferred state management solution
    localStorage.setItem('analysisResults', JSON.stringify(analysisResults));
    setIsAnalyzing(false);
    onPageChange('analysis');
  };
 
  return (
<div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600">
      {isAnalyzing && <LoadingScreen />}
<div className="p-8">
<div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
<div className="flex items-center space-x-4">
<BarChart2 className="w-8 h-8 text-orange-500" />
<h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                ObserFlow
</h1>
<span className="text-2xl">📊</span>
</div>
<p className="mt-1 text-gray-600">Intelligent Data Analysis Platform</p>
</div>
 
          {/* Upload Section */}
<div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg justify-center">
{/* <button
                          onClick={() => {
                            fileRef.current?.click()

                          }}
              className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-blue-900 text-white 
                       py-3 px-6 rounded-lg hover:from-blue-500 hover:to-blue-600 
                       transition-all transform hover:scale-105 shadow-lg ml-96"
>
              select Data
</button> */}
<input
              type="file"
              
              onChange={handleFileChange}
              // className="hidden"
              accept=".csv"
            />
            
<button
                          onClick={
                            handleUpload
                          }
              className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-blue-900 text-white 
                       py-3 px-6 rounded-lg hover:from-blue-500 hover:to-blue-600 
                       transition-all transform hover:scale-105 shadow-lg ml-96"
>
              Upload Data
</button>

 
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) setFile(droppedFile);
              }}
              className={`mt-6 w-full h-40 border-2 border-dashed rounded-lg 
                        flex items-center justify-center transition-all ${
                          isDragging
                            ? 'border-blue-500 bg-blue-50 scale-105'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
>
<div className="text-center">
<Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
<p className="text-gray-500">Drag and drop your CSV file here</p>
<p className="text-sm text-gray-400 mt-2">or click Upload Data above</p>
</div>
</div>
 
            {file && (
<div className="mt-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
<div className="flex items-center">
    <FileText className="w-5 h-5 mr-2 text-teal-600" />
    <span className="font-medium">{file.name}</span>
</div>
      <button
                        onClick={() => setFile(null)}
                        className="p-2 hover:bg-red-100 rounded-full text-red-500 
                                transition-colors transform hover:scale-110"
      >
    <X className="w-4 h-4" />
    </button>
</div>
            )}
 
            {file && (
<div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Business Objective</h2>
    <p className="text-sm text-gray-600 mb-2">
                      Start with "Predict..." to specify your target variable
    </p>
    <textarea
            className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 
                    focus:ring-blue-500 transition-all"
            placeholder="Example: Predict monthly sales revenue based on historical data..."
            value={businessGoal}
            onChange={(e) => setBusinessGoal(e.target.value)}
              />

    <button
            onClick={handleAnalyze}
            disabled={!businessGoal.trim()}
            className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 
                    text-white px-8 py-3 rounded-lg transition-all 
                    disabled:from-gray-400 disabled:to-gray-500 
                    disabled:cursor-not-allowed shadow-lg
                    hover:scale-105 active:scale-95">
                  Analyze Data
    </button>
</div>
            )}
</div>
</div>
</div>
</div>
  );
};
 
export default UploadPage;