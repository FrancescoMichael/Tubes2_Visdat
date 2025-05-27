import React from 'react'

interface StatCardProps {
  value: string
  label: string
  numFontFamily?: string
  descFontFamily?: string
}

const StatCard: React.FC<StatCardProps> = ({ value, label, numFontFamily = 'Formula1', descFontFamily = 'Formula1' }) => (
  <div className="bg-white border-r-1 border-b-1 border-slate-300 rounded-br-2xl p-4 flex flex-col justify-center items-center text-center">
    <div className="text-2xl font-bold" style={{ fontFamily: numFontFamily }}>
      {value}
    </div>
    <div className="text-sm text-gray-500 mt-1" style={{ fontFamily: descFontFamily }}>
      {label}
    </div>
  </div>
)

export default StatCard
