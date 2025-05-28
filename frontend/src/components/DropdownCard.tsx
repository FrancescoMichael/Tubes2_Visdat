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
  if (!Array.isArray(options)) {
    console.error('DropdownCard: options must be an array');
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="mb-2">
        <label 
          htmlFor={`${title}-dropdown`} 
          className="text-xl font-bold"
          style={{ fontFamily: headingFontFamily }}
        >
          {title}
        </label>
      </div>
      <select
        id={`${title}-dropdown`}
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        style={{ fontFamily: dropdownFontFamily }}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownCard;