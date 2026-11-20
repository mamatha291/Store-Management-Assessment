import { useState, useRef, useEffect } from 'react';

function StarRating({ value, onChange, readOnly, size = 'medium' }) {
  const [hoverValue, setHoverValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleClick(starValue) {
    if (!readOnly && onChange) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);
      onChange(starValue);
    }
  }

  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24
  };
  const starSize = sizeMap[size] || 20;

  return (
    <div className="star-rating" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of 5 stars`} style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <span
            key={star}
            className={`star ${isFilled ? 'filled' : ''} ${!readOnly ? 'interactive' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            role={!readOnly ? 'radio' : undefined}
            aria-checked={!readOnly ? star === value : undefined}
            aria-label={`${star} star`}
            style={{
              fontSize: `${starSize}px`,
              color: isFilled ? '#FF9F0A' : 'var(--apple-divider, #D2D2D7)',
              transform: isFilled && isAnimating ? 'scale(1.3) rotate(-8deg)' : 'scale(1)',
              transition: 'color 180ms ease, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 180ms ease',
              filter: isFilled ? 'drop-shadow(0 2px 6px rgba(255, 159, 10, 0.45))' : 'none',
              cursor: !readOnly ? 'pointer' : 'default',
              display: 'inline-block',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;