import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import ContactUs from '../Components/contactUsModal';

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-orange-400 w-full items-center"> 
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-orange-300 bg-opacity-50 z-10" onClick={closeModal}></div>
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <ContactUs onClose={closeModal} />
          </div>
        </>
      )}
      <div className="navbar bg-black fixed w-96 sm:top-0 sm:left-0 sm:w-screen sm:z-50 sm:pb-6 shadow-md items-center">
        <div className="navbar-start">
          <a href="/" className="text-4xl md:pl-16 pl-2 pt-1 text-red-300">LuciData</a>
        </div>
        <div className="navbar-center hidden lg:flex text-red-950">
          <ul className="menu menu-horizontal pl-40 text-charcoal">
            <li className="subscription pr-4">
              <a className="nav-link hover:text-burgundy" onClick={openModal}>Contact Us</a>
            </li>
            <li className="stories pr-4">
              <a href="/stories" className="nav-link hover:text-burgundy">Success Stories</a>
            </li>
          </ul>
          <button className="btn btn-active text-orange-800 hover:text-orange-400 btn-ghost">Log In</button>
          <button className="btn btn-active text-orange-800 hover:text-orange-500 btn-ghost ml-5">Sign Up</button>
        </div>
      </div>

      {/* Centering the text container */}
      <div className="flex flex-1 items-center justify-center md:mt-14 h-full"> {/* Ensuring full height for centering */}
        <div className="flex flex-col lg:flex-row md:items-center lg:justify-between max-w-7xl w-full sm:mt-16 lg:mt-4 sm:ml-8 lg:ml-0 px-4">
          {/* Text Box Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="textBox bg-transparent lg:pr-8 max-w-md lg:max-w-xl flex flex-col items-center lg:items-center"
          >
            <motion.h1
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
              className="text-5xl md:text-6xl text-red-950 pl-4 pt-4 font-custom text-center lg:text-center"
            >
              Revolutionize the observability of data patterns throughout its lifecycle.
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 text-md md:text-base text-red-950 px-4 md:px-8 text-center lg:text-center"
            >
              Unlock the way you monitor and analyze how data is created, accessed, moved, and used – with business context.
            </motion.p>

            <div className="divider divide-red-950 text-red-950 p-8">Insight into your data</div>
            <Link to="/fileUpload">
              <button className="btn btn-wide bg-charcoal text-red-200 shadow-sm border-transparent mb-4 sm:mb-6">
                Get Started 🚀
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Main;
