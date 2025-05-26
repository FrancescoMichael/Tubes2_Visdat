// src/components/TableCard.tsx
import React from 'react'

interface TableCardProps {
  title: string
  columns: string[]
  data: (string | number)[][]
}

const TableCard: React.FC<TableCardProps> = ({ title, columns, data }) => {
  return (
    <div className="bg-white">
      <div className='rounded-tr-2xl border-t-1 border-r-1 border-slate-300'>
        <h2 style={{fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">{title}</h2>
      </div>
      <div>
        <table className="min-w-full divide-y divide-gray-200 font-semibold mb-4 pt-2 pl-2">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default TableCard
