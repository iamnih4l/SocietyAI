import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Hand } from 'lucide-react';

const ASLContext = createContext();

export const useASL = () => useContext(ASLContext);

export const ASLProvider = ({ children }) => {
  const [aslMode, setAslMode] = useState(false);
  const [hoveredWord, setHoveredWord] = useState('');

  return (
    <ASLContext.Provider value={{ aslMode, setAslMode, hoveredWord, setHoveredWord }}>
      {children}
      <ASLWidget />
    </ASLContext.Provider>
  );
};

const ASLWidget = () => {
  const { aslMode, hoveredWord } = useASL();
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const word = (hoveredWord || '').replace(/[^a-zA-Z]/g, '').toLowerCase();

  useEffect(() => {
    setCurrentLetterIdx(0);
    if (!word) return;

    // Glossary of specific words with GIFs
    const glossary = {
      'simulation': 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif', // Placeholder for ASL run/simulate
      'virality': 'https://media.giphy.com/media/l41YfG5pbKSBRllQc/giphy.gif',
      'engagement': 'https://media.giphy.com/media/3o7TKWpuEwA8zG1U40/giphy.gif',
      'controversy': 'https://media.giphy.com/media/26uf7p5vK2Qd828xy/giphy.gif',
      'risk': 'https://media.giphy.com/media/l41YvFvPj1MpsB8M8/giphy.gif',
      'positive': 'https://media.giphy.com/media/3o7TKK2a291ig372oM/giphy.gif',
      'negative': 'https://media.giphy.com/media/3o7TKoHNJTBBBP2rcA/giphy.gif',
    };

    if (glossary[word]) {
      return; // It's a glossary word, we don't animate letters
    }

    // Animate fingerspelling
    const interval = setInterval(() => {
      setCurrentLetterIdx((prev) => (prev + 1) % (word.length + 1));
    }, 800); // 800ms per letter

    return () => clearInterval(interval);
  }, [word]);

  if (!aslMode) return null;

  const glossary = {
    'simulation': 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
    'virality': 'https://media.giphy.com/media/l41YfG5pbKSBRllQc/giphy.gif',
    'engagement': 'https://media.giphy.com/media/3o7TKWpuEwA8zG1U40/giphy.gif',
    'controversy': 'https://media.giphy.com/media/26uf7p5vK2Qd828xy/giphy.gif',
    'risk': 'https://media.giphy.com/media/l41YvFvPj1MpsB8M8/giphy.gif',
    'positive': 'https://media.giphy.com/media/3o7TKK2a291ig372oM/giphy.gif',
    'negative': 'https://media.giphy.com/media/3o7TKoHNJTBBBP2rcA/giphy.gif',
  };

  return (
    <div className="asl-widget fade-in">
      <div className="asl-widget-header">
        <Hand size={16} /> ASL Interpreter
      </div>
      <div className="asl-widget-body">
        {!word ? (
          <p className="asl-placeholder">Hover over any text to see sign language translation.</p>
        ) : glossary[word] ? (
          <div className="asl-glossary">
            <img src={glossary[word]} alt={`ASL sign for ${word}`} />
            <div className="asl-word-label">{word.toUpperCase()}</div>
          </div>
        ) : (
          <div className="asl-fingerspell">
            {currentLetterIdx < word.length ? (
              <img 
                key={currentLetterIdx}
                src={`https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${word[currentLetterIdx]}.gif`} 
                alt={`ASL letter ${word[currentLetterIdx]}`} 
              />
            ) : (
              <div className="asl-space">—</div> // Pause at end of word
            )}
            <div className="asl-word-label">
              {word.split('').map((char, i) => (
                <span key={i} className={i === currentLetterIdx ? 'active-letter' : ''}>
                  {char.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component to make text hoverable for ASL
export const ASLText = ({ children }) => {
  const { aslMode, setHoveredWord } = useASL();
  
  if (!aslMode) return <>{children}</>;
  if (typeof children !== 'string') return <>{children}</>;

  const words = children.split(/(\s+)/); // Split keeping whitespace

  return (
    <>
      {words.map((word, i) => {
        if (!word.trim()) return <span key={i}>{word}</span>;
        return (
          <span 
            key={i} 
            className="asl-hoverable"
            onMouseEnter={() => setHoveredWord(word)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {word}
          </span>
        );
      })}
    </>
  );
};
