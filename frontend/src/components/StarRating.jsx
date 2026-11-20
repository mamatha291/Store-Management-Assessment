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
              color: isFilled ? '#FFD700' : 'var(--apple-divider)',
              transform: isFilled && isAnimating ? 'scale(1.2)' : 'scale(1)',
              transition: 'color 100ms ease, transform 100ms ease',
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