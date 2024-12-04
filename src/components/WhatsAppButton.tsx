import React from 'react';
import { useLocation } from 'react-router-dom';

const WhatsAppButton: React.FC = () => {
  const location = useLocation();
  
  // Don't show on dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <a
      href="https://wa.me/+32465349779"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 z-50"
      aria-label="Contact via WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.88 5.83L2.2 22l4.28-1.11c1.56 1.01 3.42 1.61 5.42 1.61 5.52 0 10-4.48 10-10S17.52 2 12 2zm.03 15.5c-1.37 0-2.7-.37-3.85-1.07l-.28-.17-2.87.75.77-2.81-.18-.29c-.77-1.23-1.18-2.65-1.18-4.13 0-4.27 3.47-7.75 7.74-7.75s7.75 3.48 7.75 7.75-3.48 7.75-7.75 7.75zm4.47-5.81c-.23-.12-1.38-.68-1.59-.76-.21-.08-.37-.12-.52.12-.15.25-.59.76-.73.91-.13.16-.27.18-.5.06-.69-.35-1.37-.64-1.91-1.45-.14-.25.14-.23.41-.77.06-.13.03-.24-.03-.33-.07-.1-.52-1.25-.71-1.71-.14-.35-.3-.3-.41-.31-.11-.01-.24-.01-.37-.01-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.08.1.14 1.43 2.18 3.47 3.06.48.21.86.33 1.16.43.49.15.93.13 1.28.08.39-.06 1.2-.49 1.37-.96.17-.47.17-.88.12-.96-.05-.09-.19-.14-.42-.26z"
        />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
