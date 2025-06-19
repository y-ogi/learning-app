import React from 'react';

interface NumberCardProps {
  number: number;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const sizeClasses = {
  small: 'w-16 h-16 text-2xl',
  medium: 'w-24 h-24 text-4xl',
  large: 'w-32 h-32 text-6xl',
};

const numberTexts = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 
  'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three',
  'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight',
  'twenty-nine', 'thirty'
];

export const NumberCard: React.FC<NumberCardProps> = ({
  number,
  isSelected = false,
  onClick,
  size = 'medium',
  showText = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${sizeClasses[size]}
        touch-target
        relative
        flex flex-col items-center justify-center
        rounded-2xl
        font-bold
        transition-all duration-200
        transform 
        cursor-pointer
        disabled:cursor-default
        active:scale-95
        hover:scale-105
        focus:outline-none
        focus:ring-4
        focus:ring-blue-300
        ${isSelected 
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
          : 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 hover:from-blue-200 hover:to-purple-200 shadow-md hover:shadow-lg'
        }
        ${!onClick ? 'pointer-events-none opacity-50' : ''}
      `}
      aria-label={`Number ${number}`}
      type="button"
    >
      <span className="select-none">{number}</span>
      {showText && (
        <span className="text-sm mt-1 font-normal">
          {numberTexts[number] || ''}
        </span>
      )}
    </button>
  );
};