// src/components/StatCard.tsx
import React from 'react'

interface StatCardProps {
  value: string
  label: string
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="bg-white border-r-2 border-b-2 border-black rounded-br-2xl p-4 flex flex-col justify-center items-center text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
)

export default StatCard
