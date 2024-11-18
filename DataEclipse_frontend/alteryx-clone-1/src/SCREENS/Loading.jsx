import React, { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bellGrey">
      <div className="text-burgundy text-lg font-semibold mb-4">Uploading your files...</div>
      <PropagateLoader color="red" className="mb-4" />
    </div>
  );
}

export default Loading;