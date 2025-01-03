import React, { useRef } from 'react';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';

interface BackgroundImageManagerProps {
  pageName: string;
  className?: string;
}

export const BackgroundImageManager: React.FC<BackgroundImageManagerProps> = ({ pageName, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { backgroundImage, isLoading, error, updateBackgroundImage } = useBackgroundImage(pageName);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await updateBackgroundImage(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Achtergrondafbeelding voor {pageName}</h3>
      
      {backgroundImage && (
        <div className="mb-4">
          <img
            src={backgroundImage}
            alt={`Huidige achtergrond voor ${pageName}`}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Bezig met uploaden...' : 'Afbeelding wijzigen'}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};
