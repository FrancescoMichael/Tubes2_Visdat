import React from 'react';

interface TableRaceProps {
  columns: string[];
  data: (string | number)[][];
  headingFontFamily?: string;
  columnFonts?: string[];
  columnSizes?: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

const TableRace: React.FC<TableRaceProps> = ({
  columns,
  data,
  columnFonts,
  columnSizes,
  currentPage,
  itemsPerPage,
}) => {
  
  const effectiveItemsPerPage = itemsPerPage ?? 5;

  const paginatedData = data.slice(
    (currentPage - 1) * effectiveItemsPerPage,
    currentPage * effectiveItemsPerPage
  );

  return (
    <div className="relative w-full">
      <div className="relative overflow-x-auto">
        <table className="min-w-full lg:min-h-60 divide-y divide-gray-200 font-semibold mb-4 pt-2">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{
                    fontFamily: columnFonts?.[index],
                    fontSize: columnSizes?.[index]
                      ? `${columnSizes[index]}px`
                      : 'inherit',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row, rowIndex) => {
              let bgColor = "hover:bg-gray-50";
              let textColor = "text-black"; 

              return (
                <tr key={rowIndex} className={bgColor}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-2 py-1 text-xs ${textColor}`}
                      style={{
                        fontFamily: columnFonts?.[colIndex],
                        fontSize: columnSizes?.[colIndex]
                          ? `${columnSizes[colIndex]}px`
                          : 'inherit',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default TableRace;