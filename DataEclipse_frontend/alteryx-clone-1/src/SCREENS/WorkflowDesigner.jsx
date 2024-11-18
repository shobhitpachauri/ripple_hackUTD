import React, { useState, useRef } from 'react';
import Card from './Card';
import { 
  FileText, Database, GitBranch, Bot, BarChart2, 
  Map, ArrowRight, Table, Trash2, X
} from 'lucide-react';
 
const WorkflowDesigner = () => {
  const [hoveredFile, setHoveredFile] = useState(null);
  const [workflowData, setWorkflowData] = useState({
    nodes: [],
    connections: []
  });
  const fileInputRef = useRef(null);
 
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        setWorkflowData(prev => ({
          ...prev,
          nodes: [...prev.nodes, {
            id: `file-${Date.now()}`,
            type: 'input',
            data: {
              name: file.name,
              size: `${(file.size / 1024).toFixed(2)} KB`,
              columns: headers.length,
              rows: rows.length - 1,
              preview: headers
            }
          }]
        }));
      };
      reader.readAsText(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };
 
  const removeFile = (nodeId) => {
    setWorkflowData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      // Also remove any connections associated with this node
      connections: prev.connections.filter(conn => 
        conn.source !== nodeId && conn.target !== nodeId
      )
    }));
  };
 
  return (
<div className="min-h-screen bg-gray-50 p-6">
      {/* Workflow Header */}
<div className="mb-6">
<h1 className="text-2xl font-bold text-gray-800">Analytic Process Automation</h1>
<div className="flex space-x-4 mt-2">
<button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            onClick={() => fileInputRef.current.click()}
>
<FileText className="w-4 h-4" />
<span>Add Input Data</span>
</button>
<input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleFileUpload}
          />
</div>
</div>
 
      {/* Main Workflow Area */}
<div className="grid grid-cols-4 gap-4">
        {/* Data Input Section */}
<div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
<h2 className="text-lg font-semibold mb-4">Data Input</h2>
          {workflowData.nodes.filter(node => node.type === 'input').map((node) => (
<div
              key={node.id}
              className="relative group"
              onMouseEnter={() => setHoveredFile(node.id)}
              onMouseLeave={() => setHoveredFile(null)}
>
<Card className="p-3 mb-2 cursor-pointer hover:bg-blue-50">
<div className="flex items-center justify-between">
<div className="flex items-center">
<FileText className="w-5 h-5 mr-2 text-blue-600" />
<span className="text-sm">{node.data.name}</span>
</div>
<button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(node.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full text-red-500 transition-opacity"
                    title="Remove file"
>
<Trash2 className="w-4 h-4" />
</button>
</div>
                {/* Hover Information Card */}
                {hoveredFile === node.id && (
<div className="absolute left-full ml-2 top-0 w-64 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10">
<div className="flex justify-between items-start">
<h3 className="font-semibold mb-2">File Information</h3>
<button
                        onClick={() => setHoveredFile(null)}
                        className="p-1 hover:bg-gray-100 rounded-full"
>
<X className="w-4 h-4 text-gray-500" />
</button>
</div>
<div className="space-y-2 text-sm">
<div>
<span className="font-medium">Size:</span> {node.data.size}
</div>
<div>
<span className="font-medium">Columns:</span> {node.data.columns}
</div>
<div>
<span className="font-medium">Rows:</span> {node.data.rows}
</div>
<div>
<span className="font-medium">Headers:</span>
<div className="mt-1 text-xs text-gray-600">
                          {node.data.preview.map((header, i) => (
<div key={i} className="truncate">{header}</div>
                          ))}
</div>
</div>
</div>
</div>
                )}
</Card>
</div>
          ))}
          {workflowData.nodes.length === 0 && (
<div className="text-center text-gray-500 py-8">
<FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
<p className="text-sm">No files uploaded yet</p>
<p className="text-xs mt-1">Click "Add Input Data" to begin</p>
</div>
          )}
</div>
 
        {/* Data Prep Section */}
<div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
<h2 className="text-lg font-semibold mb-4">Data Prep</h2>
<div className="flex flex-col space-y-2">
<WorkflowNode icon={<GitBranch />} label="Blend" />
<WorkflowNode icon={<Table />} label="Reconcile" />
</div>
</div>
 
        {/* Machine Learning Section */}
<div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
<h2 className="text-lg font-semibold mb-4">Automated ML</h2>
<div className="flex flex-col space-y-2">
<WorkflowNode icon={<Bot />} label="Train Model" />
<WorkflowNode icon={<BarChart2 />} label="Evaluate" />
</div>
</div>
 
        {/* Output Section */}
<div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
<h2 className="text-lg font-semibold mb-4">Business Outputs</h2>
<div className="flex flex-col space-y-2">
<WorkflowNode icon={<Database />} label="Store Results" />
<WorkflowNode icon={<FileText />} label="Generate Report" />
</div>
</div>
</div>
</div>
  );
};
 
const WorkflowNode = ({ icon, label }) => (
<div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
      {icon}
</div>
<span className="text-sm font-medium">{label}</span>
</div>
);
 
export default WorkflowDesigner;