import React from 'react';
import { useLocation } from 'react-router-dom';

const WhatsAppButton: React.FC = () => {
  const location = useLocation();
  
  // Don't show on dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            }
            70% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(37, 211, 102, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .whatsapp-button {
            animation: float 3s ease-in-out infinite;
            transition: all 0.3s ease;
          }

          .whatsapp-button:hover {
            transform: scale(1.1);
            box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
          }

          .whatsapp-icon {
            position: relative;
            transition: all 0.3s ease;
          }

          .whatsapp-button:hover .whatsapp-icon {
            transform: scale(1.1);
          }

          .pulse-ring {
            animation: pulse 2s infinite;
          }
        `}
      </style>
      <a
        href="https://wa.me/+32465349779"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center pulse-ring"
        style={{ 
          width: '60px', 
          height: '60px',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
        aria-label="Contact via WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="whatsapp-icon"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.4752 9.84615C12.1279 9.07692 11.8925 9.07692 11.6571 9.07692C11.4218 9.07692 11.1864 9.07692 10.9511 9.07692C10.7157 9.07692 10.3684 9.19231 10.0211 9.65385C9.67373 10.1154 8.86218 10.8846 8.86218 12.4615C8.86218 14.0385 10.0211 15.5769 10.1684 15.8077C10.3157 16.0385 12.4752 19.5 15.9157 20.9615C18.7398 22.1923 19.3934 21.9615 20.0925 21.9231C20.7916 21.8846 22.1209 21.1538 22.4682 20.2692C22.8155 19.3846 22.8155 18.6538 22.7039 18.4615C22.5923 18.2692 22.3569 18.1538 22.0096 17.9231C21.6623 17.6923 20.0925 16.9231 19.7452 16.7692C19.398 16.6154 19.1627 16.5385 18.9273 16.8846C18.692 17.2308 18.0848 17.9231 17.8495 18.1538C17.6141 18.3846 17.3787 18.4231 17.0314 18.1923C16.6841 17.9615 15.6555 17.6154 14.4382 16.5385C13.4841 15.6923 12.8398 14.6538 12.6045 14.3077C12.3691 13.9615 12.5718 13.7308 12.7645 13.5385C12.9573 13.3462 13.15 13.0385 13.3854 12.8077C13.6207 12.5769 13.7327 12.4231 13.8800 12.1923C14.0273 11.9615 13.9157 11.7308 13.8041 11.5385C13.6925 11.3462 12.8927 9.73077 12.4752 9.84615Z"
            fill="white"
          />
        </svg>
      </a>
    </>
  );
};

export default WhatsAppButton;
