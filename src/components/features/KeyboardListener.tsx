import { useEffect } from 'react';

const KeyboardListener = ({ onKeyPressed }:any) => {
  const handleKeyPress = (event:any) => {
    onKeyPressed(event.key);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onKeyPressed]);

  return null;
};

export default KeyboardListener;

