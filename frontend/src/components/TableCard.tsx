import React, { useState } from 'react';

interface TableCardProps {
  title: string;
  columns: string[];
  data: (string | number)[][];
  headingFontFamily?: string;
  columnFonts?: string[];
  columnSizes?: number[];
}

const TableCard: React.FC<TableCardProps> = ({
  title,
  columns,
  data,
  headingFontFamily,
  columnFonts,
  columnSizes,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
        <table className="min-w-full divide-y divide-gray-200 font-semibold mb-4 pt-2 pl-2">
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
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm text-gray-600"
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
            ))}
          </tbody>
        </table>

        {/* Vertical Pagination */}
        <div  style={{ fontFamily: headingFontFamily }} className="absolute top-24 right-2 flex flex-col items-center space-y-1">
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
