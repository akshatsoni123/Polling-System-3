import { useState, useEffect } from 'react';

// Styles for the entire component
const KickedOutStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .kicked-out-container {
            font-family: 'Sora', sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
            padding: 2rem;
        }

        .main-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 26px;
        }

        .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%);
            color: #FFFFFF;
            padding: 9px 12px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 57px; /* Vertical distance from title */
        }

        .brand-badge-icon {
            width: 15px;
            height: 15px;
        }
        
        .title-section {
             display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }

        .main-title {
            font-size: 40px;
            font-weight: 400;
            line-height: 50px;
            margin: 0;
        }

        .subtitle {
            font-size: 19px;
            font-weight: 400;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.5);
            max-width: 550px; /* To prevent text from being too wide */
            margin: 0;
        }Q
    `}</style>
);

function KickedOut() {
  return (
    <>
      <KickedOutStyles />
      <div className="kicked-out-container">
        <div className="main-content">
            <div className="brand-badge">
                 <svg className="brand-badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" >
                    <path d="M12 2L14.09 8.26L20 10.34L14.09 12.42L12 18.68L9.91 12.42L4 10.34L9.91 8.26L12 2Z" />
                </svg>
                <span>Intervue Poll</span>
            </div>
            <div className="title-section">
                <h1 className="main-title">You’ve been Kicked out !</h1>
                <p className="subtitle">
                    Looks like the teacher had removed you from the poll system. Please Try again sometime.
                </p>
            </div>
        </div>
      </div>
    </>
  );
}

export default KickedOut;
