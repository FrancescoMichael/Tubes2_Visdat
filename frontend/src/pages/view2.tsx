import { useCallback } from "react";
// import pattern from "../assets/pattern.png";
// import bannerRed from "../assets/banner-red.png";
// import circuit from "../assets/circuit.png";
import "../assets/fonts/Formula1-Regular_web_0.ttf";
import type { View2Props } from "../models/props";
import TableCard from "../components/TableCard";
import CircuitCard from "../components/CircuitCard";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { API_CIRCUITS, API_CIRCUITS_RESULT } from "../constant";
import type { F1Season, RaceData, RaceResult } from "../models/circuit";

export default function View2({year}: View2Props) {

    const tableTitle = 'Race Results';
    const tableColumns = ['Position', 'Driver', 'Points']

    const [urlCircuit, setUrlCircuit] = useState(`${API_CIRCUITS}/${year}`)
    const [urlCircuitResult, setUrlCircuitResult] = useState<string | null>(null)
    const { data: circuitData } = useFetch<F1Season>(urlCircuit)
    const { data: circuitResultData } = useFetch<RaceData>(urlCircuitResult || '')

    const [currentPage, setCurrentPage] = useState(1)
    const [currentCircuitPage, setCurrentCircuitPage] = useState(1)
    
    useEffect(() => {
        if (year) {
            setUrlCircuit(`${API_CIRCUITS}/${year}`)
            setCurrentPage(1)
            setCurrentCircuitPage(1)
        }
    }, [year])


    // Memoize getCurrentCircuit to avoid unnecessary re-renders and fix dependency warning
    const getCurrentCircuit = useCallback(() => {
        if (!circuitData?.circuits || circuitData.circuits.length === 0) {
            return null;
        }
        const circuitIndex = currentCircuitPage - 1;
        return circuitData.circuits[circuitIndex] || circuitData.circuits[0];
    }, [circuitData, currentCircuitPage]);

    // Update circuit result URL when circuit page changes or circuit data is available
    useEffect(() => {
        if (circuitData?.circuits && circuitData.circuits.length > 0) {
            const currentCircuit = getCurrentCircuit();
            if (currentCircuit?.circuit_id) {
                setUrlCircuitResult(`${API_CIRCUITS_RESULT}/${year}/${currentCircuit.circuit_id}`)
            }
        }
    }, [circuitData, currentCircuitPage, year, getCurrentCircuit])

    const getTableData = () => {
        if (!circuitResultData) return []
        const drivers = circuitResultData.results as RaceResult[]
        console.log(typeof drivers[0].driver.name === 'string')
        return drivers.map(driver => [
            driver.position,
            driver.driver.name,
            driver.points
        ])
    }

    const currentCircuit = getCurrentCircuit();
    const totalCircuits = circuitData?.circuits?.length || 0;

    return (
        <div className="bg-white">
            <div className="WRAPPER grid grid-cols-2 gap-8 w-full p-6 pt-2">
                <div className='LEFTHALF'>
                    <CircuitCard 
                        title={currentCircuit?.races[0]?.name ?? 'Circuit Name'}
                        circuit_name={currentCircuit?.name ?? 'Circuit Name'}
                        location_country={currentCircuit?.country ?? 'Country'}
                        location_city={currentCircuit?.location ?? 'City'}
                        numberOfLaps={currentCircuit?.races[0]?.total_laps ?? 0}
                        imageUrl={currentCircuit?.url ?? 'https://via.placeholder.com/400x300?text=Circuit+Image'}
                        currentPage={currentCircuitPage}
                        totalPages={totalCircuits}
                        onPageChange={setCurrentCircuitPage}
                    />
                </div>
                <div className='RIGHTHALF grid grid-cols-1'>
                    <div className="relative bg-black p-6 rounded-lg mb-8">
                        {/* F1 Header */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-red-600 h-2 w-full"></div>
                            <img 
                                src="https://logos-world.net/wp-content/uploads/2023/12/F1-Logo-500x281.png" 
                                alt="F1 Logo" 
                                className="h-32 object-cover rounded"
                            />
                            <div className="bg-red-600 h-2 w-full"></div>
                        </div>
                        <div style={{ fontFamily: "Formula1Bold" }} className="text-center text-white text-3xl font-bold mb-8 tracking-wider">
                            {currentCircuit?.location?.toUpperCase() ?? 'MONACO'}
                        </div>
                        
                        {/* Podium */}
                        <div className="flex items-end justify-center gap-4">
                            {/* 2nd Place - Left */}
                            <div className="flex flex-col items-center">
                                <div className="bg-red-600 rounded-t-lg p-6 pt-8 min-h-[300px] w-48 flex flex-col items-center justify-end relative">
                                    <div className="absolute top-4 left-4">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">2</div>
                                    </div>
                                    <div className="mb-4">
                                        <img 
                                            src="https://via.placeholder.com/120x150/8B0000/FFFFFF?text=DRIVER" 
                                            alt="2nd Place Driver" 
                                            className="w-24 h-32 object-cover rounded"
                                        />
                                    </div>
                                   <div className="text-center text-white">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="font-bold text-lg mb-1">
                                            {typeof getTableData()[1]?.[1] === 'string'
                                                ? (getTableData()[1][1] as string).split(' ').slice(-1)[0]?.toUpperCase()
                                                : 'WWOI'}
                                        </div>
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
                                            {getTableData()[1]?.[2] ?? '0'} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 1st Place - Center */}
                            <div className="flex flex-col items-center">
                                <div className="bg-orange-500 rounded-t-lg p-6 pt-8 min-h-[350px] w-48 flex flex-col items-center justify-end relative">
                                    <div className="absolute top-4 left-4">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">1</div>
                                    </div>
                                    <div className="mb-4">
                                        <img 
                                            src="https://via.placeholder.com/120x150/FF8C00/FFFFFF?text=DRIVER" 
                                            alt="1st Place Driver" 
                                            className="w-24 h-32 object-cover rounded"
                                        />
                                    </div>
                                    <div className="text-center text-white">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="font-bold text-lg mb-1">
                                            {typeof getTableData()[0]?.[1] === 'string'
                                                ? (getTableData()[0][1] as string).split(' ').slice(-1)[0]?.toUpperCase()
                                                : 'WWOI'}
                                        </div>
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
                                            {getTableData()[0]?.[2] ?? '0'} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3rd Place - Right */}
                            <div className="flex flex-col items-center">
                                <div className="bg-orange-600 rounded-t-lg p-6 pt-8 min-h-[280px] w-48 flex flex-col items-center justify-end relative">
                                    <div className="absolute top-4 left-4">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">3</div>
                                    </div>
                                    <div className="mb-4">
                                        <img 
                                            src="https://via.placeholder.com/120x150/CC5500/FFFFFF?text=DRIVER" 
                                            alt="3rd Place Driver" 
                                            className="w-24 h-32 object-cover rounded"
                                        />
                                    </div>
                                    <div className="text-center text-white">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="font-bold text-lg mb-1">
                                            {typeof getTableData()[2]?.[1] === 'string'
                                                ? (getTableData()[2][1] as string).split(' ').slice(-1)[0]?.toUpperCase()
                                                : 'WWOI'}
                                        </div>
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
                                            {getTableData()[2]?.[2] ?? '0'} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TableCard
                        title={tableTitle}
                        columns={tableColumns}
                        data={getTableData().slice(3, 10)}  // Only 4th to 10th
                        headingFontFamily='Formula1Bold'
                        columnFonts={['Formula1', 'Formula1', 'Formula1']}
                        columnSizes={[14, 16, 14]}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        itemsPerPage={7}
                    />
                </div>
            </div>
        </div>
    );
}