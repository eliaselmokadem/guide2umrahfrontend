import { useState, useEffect } from 'react';
import axios from 'axios';

interface BackgroundImage {
  pageName: string;
  imageUrl: string;
  updatedAt: string;
}

interface UseBackgroundImageReturn {
  backgroundImage: string | null;
  isLoading: boolean;
  error: string | null;
  updateBackgroundImage: (file: File) => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const useBackgroundImage = (pageName: string): UseBackgroundImageReturn => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await axios.get<{ success: boolean; data: BackgroundImage }>(
          `${API_BASE_URL}/api/background-image/${pageName}`
        );
        setBackgroundImage(response.data.data.imageUrl);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          // No background image set yet - this is not an error
          setBackgroundImage(null);
        } else {
          setError('Er is een fout opgetreden bij het ophalen van de achtergrondafbeelding.');
          console.error('Error fetching background image:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackgroundImage();
  }, [pageName]);

  const updateBackgroundImage = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('pageName', pageName);

      const response = await axios.post<{ success: boolean; data: BackgroundImage }>(
        `${API_BASE_URL}/api/background-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setBackgroundImage(response.data.data.imageUrl);
      setError(null);
    } catch (err) {
      setError('Er is een fout opgetreden bij het uploaden van de afbeelding.');
      console.error('Error updating background image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    backgroundImage,
    isLoading,
    error,
    updateBackgroundImage,
  };
};
