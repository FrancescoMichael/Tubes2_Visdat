import { useState } from 'react';

interface DropdownCardProps {
  title: string;
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void; 
  headingFontFamily?: string;
  dropdownFontFamily?: string;
}

const DropdownCard: React.FC<DropdownCardProps> = ({
  title,
  options = [],
  selectedOption,
  onChange,
  headingFontFamily = 'Formula1',
  dropdownFontFamily = 'Formula1'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!Array.isArray(options)) {
    console.error('DropdownCard: options must be an array');
    return null;
  }

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // Calculate height for maximum 10 options (assuming ~40px per option)
  const maxHeight = Math.min(options.length, 10) * 30 + 25;

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full relative">
      <div className="mb-2">
        <label 
          htmlFor={`${title}-dropdown`} 
          className="text-xl font-bold"
          style={{ fontFamily: headingFontFamily }}
        >
          {title}
        </label>
      </div>
      
      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left bg-white flex justify-between items-center"
          style={{ fontFamily: dropdownFontFamily }}
        >
          <span>{selectedOption}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Options - Max 10 visible with scroll */}
            <div 
              className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-20 overflow-y-auto"
              style={{ 
                maxHeight: `${maxHeight}px`,
                fontFamily: dropdownFontFamily 
              }}
            >
              {options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    option === selectedOption ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  style={{ minHeight: '40px' }}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DropdownCard;