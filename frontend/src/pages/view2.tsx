import { useCallback, useMemo } from "react";
import bannerBlack from "../assets/banner-black.png";
import "../assets/fonts/Formula1-Regular_web_0.ttf";
import type { View2Props } from "../models/props";
import TableRace from "../components/TableRace";
import CircuitCard from "../components/CircuitCard";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { API_CIRCUITS, API_CIRCUITS_RESULT } from "../constant";
import type { F1Season, RaceData, RaceResult } from "../models/circuit";

export default function View2({year}: View2Props) {

    const tableColumns = ['Position', 'Driver', 'Points']

    const [urlCircuit, setUrlCircuit] = useState(`${API_CIRCUITS}/${year}`)
    const [urlCircuitResult, setUrlCircuitResult] = useState<string | null>(null)
    const { data: circuitData } = useFetch<F1Season>(urlCircuit)
    const { data: circuitResultData } = useFetch<RaceData>(urlCircuitResult || '')

    const [currentPage, setCurrentPage] = useState(1)
    const [currentCircuitPage, setCurrentCircuitPage] = useState(1)
    
    // State for handling image fallback
    const [circuitImageSrc, setCircuitImageSrc] = useState('')
    const [imageErrorStage, setImageErrorStage] = useState(0) // 0=svg, 1=png, 2=jpeg, 3=gif
    
    useEffect(() => {
        if (year) {
            setUrlCircuit(`${API_CIRCUITS}/${year}`)
            setCurrentPage(1)
            setCurrentCircuitPage(1)
        }
    }, [year])

    const fileExtensions = useMemo(() => ['svg', 'png', 'jpeg', 'gif'], []);

    // Reset image state when circuit changes
    useEffect(() => {
        if (circuitResultData?.circuit.circuit_id) {
            setImageErrorStage(0)
            const ext = fileExtensions[0]
            setCircuitImageSrc(`circuit_${circuitResultData.circuit.circuit_id}.${ext}`)
        }
    }, [circuitResultData?.circuit.circuit_id, fileExtensions])

    // Handle image error - fallback to next extension
    const handleCircuitImageError = useCallback(() => {
        if (circuitResultData?.circuit.circuit_id && imageErrorStage < fileExtensions.length - 1) {
            const nextStage = imageErrorStage + 1
            const ext = fileExtensions[nextStage]
            setCircuitImageSrc(`circuit_${circuitResultData.circuit.circuit_id}.${ext}`)
            setImageErrorStage(nextStage)
        }
    }, [circuitResultData?.circuit.circuit_id, imageErrorStage, fileExtensions]);

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
                        numberOfTurns={circuitResultData?.circuit.turns ?? '0'}
                        imageUrl={circuitImageSrc}
                        onImageError={handleCircuitImageError}
                        length={circuitResultData?.circuit.last_length_used ?? '0 km'}
                        currentPage={currentCircuitPage}
                        totalPages={totalCircuits}
                        onPageChange={setCurrentCircuitPage}
                    />
                </div>
                <div className='RIGHTHALF grid grid-cols-1'>
                    <div className="relative rounded-lg mb-2">
                        {/* F1 Header */}
                        <div className='flex flex-row gap-2 justify-center items-center '>
                            <div className="w-1/4 mt-2">
                                <p style={{ fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">Race Result</p>
                            </div>
                            <div className="w-3/4">
                                <img src={bannerBlack} alt="Line Chart Icon" className="w-full" />
                            </div>
                        </div>
                        
                        {/* Podium */}
                        <div className="flex items-end justify-center gap-4">
                            {/* 2nd Place - Left */}
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-200 rounded-t-lg p-6 pt-8 min-h-[275px] w-48 flex flex-col items-center justify-end relative">
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
                                   <div className="text-center text-black">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="font-bold text-lg mb-1">
                                            {typeof getTableData()[1]?.[1] === 'string'
                                                ? (getTableData()[1][1] as string).split(' ').slice(-1)[0]?.toUpperCase()
                                                : ''}
                                        </div>
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
                                            {getTableData()[1]?.[2] ?? '0'} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 1st Place - Center */}
                            <div className="flex flex-col items-center">
                                <div className="bg-yellow-300  rounded-t-lg p-6 pt-8 min-h-[300px] w-48 flex flex-col items-center justify-end relative">
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
                                    <div className="text-center text-black">
                                        <div style={{ fontFamily: "Formula1Bold" }} className="font-bold text-lg mb-1">
                                            {typeof getTableData()[0]?.[1] === 'string'
                                                ? (getTableData()[0][1] as string).split(' ').slice(-1)[0]?.toUpperCase()
                                                : ''}
                                        </div>
                                        <div style={{ fontFamily: "Formula1Bold" }} className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
                                            {getTableData()[0]?.[2] ?? '0'} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3rd Place - Right */}
                            <div className="flex flex-col items-center">
                                <div className="bg-amber-600 rounded-t-lg p-6 pt-8 min-h-[250px] w-48 flex flex-col items-center justify-end relative">
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
                                    <div className="text-center text-black">
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

                    <TableRace
                        columns={tableColumns}
                        data={getTableData().slice(3, 10)}
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