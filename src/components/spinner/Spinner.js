import React from 'react';

import "./Spinner.css";

const Spinner = () => {
    const messageContainer = document.getElementById('messageContainer');
  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
    return (
        <div className="loader">
            <div className={`circle circle1`}></div>
            <div className={`circle circle2`}></div>
            <div className={`circle circle3`}></div>
            <div className={`circle circle4`}></div>
        </div>
)
}

export default Spinner;