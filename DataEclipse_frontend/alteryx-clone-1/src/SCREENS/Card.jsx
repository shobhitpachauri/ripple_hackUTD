import React from 'react'

const Card = ({ children, className = '' }) => {
    return <div className={`bg-white p-4 rounded shadow ${className}`}>{children}</div>;
  };
  
  export default Card;
  
