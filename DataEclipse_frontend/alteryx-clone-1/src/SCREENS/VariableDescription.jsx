import React, { useState } from 'react';
import { BarChart2, Calendar, Hash, List, ChevronRight, Info } from 'lucide-react';
 
const VariableDescription = () => {
  const [selectedVariable, setSelectedVariable] = useState(null);
  // Sample backend data (in real app, this would come from your backend)
  const variables = {
    integer: [
      { name: 'Var1', description: 'Integer variable 1' },
      { name: 'Var2', description: 'Integer variable 2' },
      { name: 'Var4', description: 'Integer variable 4' }
    ],
    categorical: [
      { name: 'Cat Varr1', description: 'Categorical variable 1' },
      { name: 'Cat Varr2', description: 'Categorical variable 2' },
      { name: 'Cat Varr3', description: 'Categorical variable 3' }
    ],
    date: [
      { name: 'Date Varr8', description: 'Date variable 8' }
    ]
  };
 
  const VariableStats = ({ variable }) => (
<div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
<div className="flex justify-between items-start">
<h3 className="text-xl font-bold text-gray-800">{variable.name}</h3>
<Info className="w-5 h-5 text-blue-500" />
</div>
<div className="space-y-2">
<div className="flex items-center justify-between text-sm">
<span className="text-gray-600">Valid</span>
<span className="font-medium">350 (100%)</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-gray-600">Missing</span>
<span className="font-medium">0 (0%)</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-gray-600">Mismatched</span>
<span className="font-medium">0 (0%)</span>
</div>
</div>
 
      <div className="pt-4 border-t">
<div className="space-y-2">
<div className="flex items-center justify-between text-sm">
<span className="text-gray-600">Minimum</span>
<span className="font-medium">1Mar12</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-gray-600">Mean</span>
<span className="font-medium">23Apr15</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-gray-600">Maximum</span>
<span className="font-medium">25Dec17</span>
</div>
</div>
</div>
 
      {/* Distribution Graph */}
<div className="h-32 mt-4 bg-blue-50 rounded-lg relative">
<div className="absolute inset-0 flex items-end justify-around px-2">
          {[0.3, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.5].map((height, index) => (
<div
              key={index}
              className="w-6 bg-blue-500 rounded-t"
              style={{ height: `${height * 100}%` }}
            />
          ))}
</div>
</div>
</div>
  );
 
  return (
<div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 p-8">
<div className="max-w-7xl mx-auto">
<div className="grid grid-cols-4 gap-6">
          {/* Variables List */}
<div className="col-span-1 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
<h2 className="text-xl font-bold mb-6 text-gray-800">Variables</h2>
            {/* Integer Variables */}
<div className="mb-6">
<div className="flex items-center space-x-2 mb-3 text-gray-700">
<Hash className="w-4 h-4" />
<span className="font-medium">Integer Type</span>
</div>
<div className="space-y-2">
                {variables.integer.map((variable) => (
<button
                    key={variable.name}
                    onClick={() => setSelectedVariable(variable)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-blue-50 transition-colors ${
                      selectedVariable?.name === variable.name ? 'bg-blue-50' : ''
                    }`}
>
<span className="text-sm">{variable.name}</span>
<ChevronRight className="w-4 h-4 text-gray-400" />
</button>
                ))}
</div>
</div>
 
            {/* Categorical Variables */}
<div className="mb-6">
<div className="flex items-center space-x-2 mb-3 text-gray-700">
<List className="w-4 h-4" />
<span className="font-medium">Categorical</span>
</div>
<div className="space-y-2">
                {variables.categorical.map((variable) => (
<button
                    key={variable.name}
                    onClick={() => setSelectedVariable(variable)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-blue-50 transition-colors ${
                      selectedVariable?.name === variable.name ? 'bg-blue-50' : ''
                    }`}
>
<span className="text-sm">{variable.name}</span>
<ChevronRight className="w-4 h-4 text-gray-400" />
</button>
                ))}
</div>
</div>
 
            {/* Date Variables */}
<div>
<div className="flex items-center space-x-2 mb-3 text-gray-700">
<Calendar className="w-4 h-4" />
<span className="font-medium">Date</span>
</div>
<div className="space-y-2">
                {variables.date.map((variable) => (
<button
                    key={variable.name}
                    onClick={() => setSelectedVariable(variable)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-blue-50 transition-colors ${
                      selectedVariable?.name === variable.name ? 'bg-blue-50' : ''
                    }`}
>
<span className="text-sm">{variable.name}</span>
<ChevronRight className="w-4 h-4 text-gray-400" />
</button>
                ))}
</div>
</div>
</div>
 
          {/* Variable Description */}
<div className="col-span-3">
            {selectedVariable ? (
<VariableStats variable={selectedVariable} />
            ) : (
<div className="h-full flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
<div className="text-center text-gray-500">
<BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
<p>Select a variable to view its description</p>
</div>
</div>
            )}
</div>
</div>
</div>
</div>
  );
};
 
export default VariableDescription;