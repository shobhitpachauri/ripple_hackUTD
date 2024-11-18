import React from 'react';

const ContactUs = ({ onClose }) => {
  return (
    <div className="modal-box bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold text-burgundy mb-4">Contact Us</h2>
      <p className="text-charcoal mb-4">You can reach us at: <strong>contact@resumebuild.com</strong></p>
      <button className="btn mr-auto bg-charcoal text-white" onClick={onClose}>Close</button>
    </div>
  );
};

export default ContactUs;
