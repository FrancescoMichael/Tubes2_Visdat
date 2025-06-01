import React from 'react';

interface TableCardProps {
  title: string;
  columns: string[];
  data: (string | number)[][];
  headingFontFamily?: string;
  columnFonts?: string[];
  columnSizes?: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TableCard: React.FC<TableCardProps> = ({
  title,
  columns,
  data,
  headingFontFamily,
  columnFonts,
  columnSizes,
  currentPage,
  onPageChange,
}) => {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="relative w-full">
      <div className="rounded-tr-2xl border-t-1 border-r-1 border-slate-300 mt-4">
        <h2
          style={{ fontFamily: headingFontFamily }}
          className="text-2xl font-bold mb-4 pt-2 pl-2"
        >
          {title}
        </h2>
      </div>

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
              const globalIndex = (currentPage - 1) * itemsPerPage + rowIndex;
              
              let bgColor = "hover:bg-gray-50";
              if (globalIndex === 0) {
                bgColor = "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600";
              } else if (globalIndex === 1) {
                bgColor = "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500"; 
              } else if (globalIndex === 2) {
                bgColor = "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"; 
              }

              let textColor = "text-gray-600"; 
              if (globalIndex <= 2) {
                textColor = "text-white font-semibold";
              }

              return (
                <tr key={rowIndex} className={bgColor}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-2 text-sm ${textColor}`}
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

        {/* Vertical Pagination */}
        <div
          style={{ fontFamily: headingFontFamily }}
          className="absolute top-24 right-2 flex flex-col items-center space-y-1"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-600 hover:text-black disabled:opacity-30 text-xl"
            title="Previous Page"
          >
            ↑
          </button>
          <span className="text-sm text-gray-500 font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-600 hover:text-black disabled:opacity-30 text-xl"
            title="Next Page"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableCard;