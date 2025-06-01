import pattern from "../assets/pattern.png";
// import bannerRed from "../assets/banner-red.png";
import circuit from "../assets/circuit.png";
import "../assets/fonts/Formula1-Regular_web_0.ttf";
import type { View2Props } from "../models/props";
import TableCard from "../components/TableCard";
import useFetch from "../hooks/useFetch";
import type { DriverStanding } from "../models/standing";
import { useEffect, useState } from "react";
import { API_DRIVER_STANDINGS } from "../constant";
export default function View2({year}: View2Props) {

    const tableTitle = 'Race Results';
    const tableColumns = ['Position', 'Driver', 'Points']

    const [urlStandings, setUrlStandings] = useState(`${API_DRIVER_STANDINGS}/${year}`)
    const { data: standings } = useFetch<DriverStanding[]>(urlStandings)

    const [currentPage, setCurrentPage] = useState(1)

     useEffect(() => {
        if (year) {
          setUrlStandings(`http://localhost:5000/api/standings/drivers/${year}`)
          setCurrentPage(1)
        }
      }, [year])

    const getTableData = () => {
    if (!standings) return []
    const drivers = standings as DriverStanding[]

    return drivers.map(driver => [
    driver.rank,
    driver.driver_name,
    driver.total_points
    ])
    }

    return (
    <div className="bg-white">
        <div className="WRAPPER grid grid-cols-2 gap-8 w-full p-6 pt-2">
            <div className='LEFTHALF'>
                <div className="">
                    <p style={{ fontFamily: "Formula1Bold" }} className="text-3xl font-bold mb-2 pt-2 pl-2">
                        Australian Grand Prix
                    </p>   
                </div>
                <div className="">
                    <p style={{ fontFamily: "Formula1" }} className="text-xl mb-2 pt-2 pl-2">
                        Albert Park Grand Prix Circuit
                    </p>   
                </div>
                <div className="border-t-10 border-r-10 border-red-500 rounded-tr-4xl pt-6 pr-6 flex items-center justify-between bg-white gap-2 ">
                    <div className="CIRCUITBANNER w-2/3 h-72">
                        <img src={circuit } alt="Line Chart Icon" className="w-full h-72 object-cover object-center" />
                    </div>
                    <div className='OVERVIEWNUMBER w-1/3 grid gap-8 grid-rows-2 h-72'>
                        <div className="bg-white border-r border-b border-gray-500 rounded-br-2xl p-4 flex flex-col">
                            <div className="">
                                <div className="bg-white text-sm text-gray-500" style={{ fontFamily: "Formula1" }}>
                                    Location
                                </div>
                                <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                    Melbourne
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-r border-b border-gray-500 rounded-br-2xl p-4 flex flex-col">
                            <div className="">
                                <div className="bg-white text-sm text-gray-500" style={{ fontFamily: "Formula1" }}>
                                    Number of Laps  
                                </div>
                                <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                    58
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
            <div className='RIGHTHALF grid grid-cols-1'>
                <div className="relative bg-black p-6 rounded-lg mb-8">
                    {/* F1 Header */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-red-600 h-2 w-full"></div>
                        <div className="mx-4 text-white font-bold text-2xl tracking-wider">F1</div>
                        <div className="bg-red-600 h-2 w-full"></div>
                    </div>
                    <div className="text-center text-white text-3xl font-bold mb-8 tracking-wider">MONACO</div>
                    
                    {/* Podium */}
                    <div className="flex items-end justify-center gap-4">
                        {/* 2nd Place - Left */}
                        <div className="flex flex-col items-center">
                            <div className="bg-red-600 rounded-t-lg p-6 pt-8 min-h-[300px] w-48 flex flex-col items-center justify-end relative">
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">2</div>
                                </div>
                                <div className="mb-4">
                                    <img 
                                        src="https://via.placeholder.com/120x150/8B0000/FFFFFF?text=DRIVER" 
                                        alt="2nd Place Driver" 
                                        className="w-24 h-32 object-cover rounded"
                                    />
                                </div>
                                <div className="text-center text-white">
                                    <div className="font-bold text-lg mb-1">LECLERC</div>
                                    <div className="bg-white text-black px-2 py-1 rounded text-sm font-bold">16 PTS</div>
                                </div>
                            </div>
                        </div>

                        {/* 1st Place - Center */}
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-500 rounded-t-lg p-6 pt-8 min-h-[350px] w-48 flex flex-col items-center justify-end relative">
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">1</div>
                                </div>
                                <div className="mb-4">
                                    <img 
                                        src="https://via.placeholder.com/120x150/FF8C00/FFFFFF?text=DRIVER" 
                                        alt="1st Place Driver" 
                                        className="w-24 h-32 object-cover rounded"
                                    />
                                </div>
                                <div className="text-center text-white">
                                    <div className="font-bold text-lg mb-1">NORRIS</div>
                                    <div className="bg-white text-black px-2 py-1 rounded text-sm font-bold">25 PTS</div>
                                </div>
                            </div>
                        </div>

                        {/* 3rd Place - Right */}
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-600 rounded-t-lg p-6 pt-8 min-h-[280px] w-48 flex flex-col items-center justify-end relative">
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">3</div>
                                </div>
                                <div className="mb-4">
                                    <img 
                                        src="https://via.placeholder.com/120x150/CC5500/FFFFFF?text=DRIVER" 
                                        alt="3rd Place Driver" 
                                        className="w-24 h-32 object-cover rounded"
                                    />
                                </div>
                                <div className="text-center text-white">
                                    <div className="font-bold text-lg mb-1">PIASTRI</div>
                                    <div className="bg-white text-black px-2 py-1 rounded text-sm font-bold">15 PTS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <TableCard
                    title={tableTitle}
                    columns={tableColumns}
                    data={getTableData() ?? []}
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