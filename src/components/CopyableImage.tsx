import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CopyableImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CopyableImage: React.FC<CopyableImageProps> = ({ src, alt, className }) => {
  const [copying, setCopying] = useState(false);

  const copyImage = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling up
    
    try {
      setCopying(true);
      
      // Create a temporary image element
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = src;
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // Convert to blob and copy
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const data = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([data]);
            toast.success('Afbeelding gekopieerd!', {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast.error('Kon de afbeelding niet kopiëren', {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Error loading image:', error);
      toast.error('Kon de afbeelding niet laden', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="relative group" onClick={copyImage}>
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity ${copying ? 'opacity-50' : 'group-hover:opacity-90'}`}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          Klik om te kopiëren
        </div>
      </div>
    </div>
  );
};

export default CopyableImage;
