import React from 'react'

interface StatCardProps {
  value: string
  label: string
  numFontFamily?: string
  descFontFamily?: string
}

const StatCard: React.FC<StatCardProps> = ({ value, label, numFontFamily = 'Formula1', descFontFamily = 'Formula1' }) => (
  <div className="bg-white rounded-bl-2xl rounded-br-2xl p-4 flex flex-col justify-center items-center text-center">
    <div className="bg-white text-2xl font-bold" style={{ fontFamily: numFontFamily }}>
      {value}
    </div>
    <div className="bg-white text-sm text-gray-500 mt-1" style={{ fontFamily: descFontFamily }}>
      {label}
    </div>
  </div>
)

export default StatCard
