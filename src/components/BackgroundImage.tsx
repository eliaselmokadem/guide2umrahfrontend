import React from 'react';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

interface BackgroundImageProps {
  pageName: string;
  children: React.ReactNode;
  className?: string;
  fallbackImage?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  pageName,
  children,
  className = '',
  fallbackImage
}) => {
  const { backgroundImage, isLoading } = useBackgroundImage(pageName);

  const style: React.CSSProperties = {
    backgroundImage: `url(${backgroundImage || fallbackImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Don't apply background style if no image is available and no fallback is provided
  const containerStyle = (backgroundImage || fallbackImage) ? style : undefined;

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {children}
    </div>
  );
};
