import React from 'react'

interface DropdownCardProps {
  title: string
  options: string[]
  selectedOption: string
  onChange: (value: string) => void
  headingFontFamily?: string
  dropdownFontFamily?: string
}

const DropdownCard: React.FC<DropdownCardProps> = ({
  title,
  options,
  selectedOption,
  onChange,
  headingFontFamily = 'Formula1',
  dropdownFontFamily = 'Formula1'
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="mb-2">
        <p
          className="text-xl font-bold"
          style={{ fontFamily: headingFontFamily }}
        >
          {title}
        </p>
      </div>
      <select
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        style={{ fontFamily: dropdownFontFamily }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DropdownCard
