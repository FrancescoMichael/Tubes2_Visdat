import { useState, useEffect } from "react";

interface CircuitCardProps {
  title: string;
  circuit_name: string;
  location_country: string;
  location_city: string;
  numberOfLaps: number;
  numberOfTurns: string;
  imageUrl: string;
  onImageError?: () => void;
  length: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CircuitCard({
    title, 
    circuit_name, 
    location_country, 
    location_city,
    numberOfTurns, 
    numberOfLaps, 
    onImageError,
    imageUrl,
    length,
    currentPage,
    totalPages,
    onPageChange
}: CircuitCardProps) {
    
    const [imageLoading, setImageLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState('');
    
    // Update image source and reset loading state when imageUrl changes
    useEffect(() => {
        const fullImageSrc = `circuit_images/${imageUrl}`;
        setImageSrc(fullImageSrc);
        setImageLoading(true);
    }, [imageUrl]);
    
    const handleImageLoad = () => {
        setImageLoading(false);
    };
    
    const handleImageError = () => {
        setImageLoading(false);
        if (onImageError) {
            onImageError();
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div>
            <div className="">
                <p style={{ fontFamily: "Formula1Bold" }} className="text-3xl font-bold mb-2 pt-2 pl-2">
                    {title}
                </p>  
            </div>
            
            <div className="">
                <p style={{ fontFamily: "Formula1" }} className="text-xl mb-2 pt-2 pl-2">
                    {circuit_name}, {location_city}, {location_country}
                </p>  
            </div>
            
            <div className="border-t-10 border-r-10 border-red-500 rounded-tr-4xl mt-8 pt-6 pr-6 flex items-center justify-between bg-white gap-2">
                <div className="CIRCUITBANNER object-contain w-2/3 h-96 relative">
                    {/* Show loading state only while image is loading */}
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                <span className="ml-3 text-gray-600" style={{ fontFamily: "Formula1" }}>
                                    Loading...
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <img 
                        key={imageSrc} // Force re-render when image changes
                        src={imageSrc}
                        alt={`${circuit_name} circuit layout`}
                        className="w-full h-72 object-contain object-center"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ 
                            display: imageLoading ? 'none' : 'block'
                        }}
                    />
                </div>
                <div className='OVERVIEWNUMBER w-1/3 grid gap-8 grid-rows-3 h-96'>
                    <div className="bg-white border-r border-b border-gray-500 rounded-br-2xl p-4 flex flex-col">
                        <div className="">
                            <div className="bg-white text-sm text-gray-500" style={{ fontFamily: "Formula1" }}>
                                Number of Turns
                            </div>
                            <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                {numberOfTurns}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border-r border-b border-gray-500 rounded-br-2xl p-4 flex flex-col">
                        <div className="">
                            <div className="bg-white text-sm text-gray-500" style={{ fontFamily: "Formula1" }}>
                                Number of Laps  
                            </div>
                            <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                {numberOfLaps}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border-r border-b border-gray-500 rounded-br-2xl p-4 flex flex-col">
                        <div className="">
                            <div className="bg-white text-sm text-gray-500" style={{ fontFamily: "Formula1" }}>
                                Circuit Length
                            </div>
                            <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                {length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Pagination controls below the circuit */}
            <div className="flex items-center justify-center gap-2 mt-8 p-2">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    style={{ fontFamily: "Formula1" }}
                >
                    ← Previous
                </button>
                <span style={{ fontFamily: "Formula1" }} className="px-4 text-lg font-semibold">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                        currentPage === totalPages 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    style={{ fontFamily: "Formula1" }}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}