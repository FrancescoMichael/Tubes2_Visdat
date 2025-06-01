import pattern from "../assets/pattern.png";
import bannerRed from "../assets/banner-red.png";
import circuitImage from "../assets/circuit.png";
import "../assets/fonts/Formula1-Regular_web_0.ttf";

export default function View2(string) {
    return (
    <div className="bg-white">
        <div className="WRAPPER grid grid-cols-2 gap-8 w-full p-6 pt-2">
            <div className='LEFTHALF'>
                <div className="">
                    <p style={{ fontFamily: "Formula1Bold" }} className="text-3xl font-bold mb-2 pt-2 pl-2">EVENT NAME</p>   
                </div>
                <div className="">
                    <p style={{ fontFamily: "Formula1" }} className="text-xl mb-2 pt-2 pl-2">CIRCUIT NAME</p>   
                </div>
                <div className="border-t-8 border-r-8 border-red-500 rounded-tr-4xl p-4">
                    <div className="CIRCUITBANNER w-full h-96 rounded-tr-4xl">
                        <img src={circuitImage  } alt="Line Chart Icon" className="w-full h-96 object-cover object-center" />
                    </div>
                    <div className="w-full mt-4 h-2 -z-10">
                        <img 
                            src={pattern} 
                            alt="Line Chart Icon" 
                            className="w-full h-24 object-cover object-center" 
                        />
                    </div>
                    <div className='OVERVIEWNUMBER -mt-8 grid gap-4 grid-cols-3 z-10 p-2'>
                        <div className="bg-white rounded-bl-2xl rounded-br-2xl p-4 flex flex-col justify-center items-center text-center">
                            <div className="">
                                <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                    Melbourne
                                </div>
                                <div className="bg-white text-sm text-gray-500 mt-1" style={{ fontFamily: "Formula1" }}>
                                    Location
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-bl-2xl rounded-br-2xl p-4 flex flex-col justify-center items-center text-center">
                            <div className="">
                                <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                    58
                                </div>
                                <div className="bg-white text-sm text-gray-500 mt-1" style={{ fontFamily: "Formula1" }}>
                                    Lap Count
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-bl-2xl rounded-br-2xl p-4 flex flex-col justify-center items-center text-center">
                            <div className="">
                                <div className="bg-white text-2xl font-bold" style={{ fontFamily: "Formula1" }}>
                                    Etc
                                </div>
                                <div className="bg-white text-sm text-gray-500 mt-1" style={{ fontFamily: "Formula1" }}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div className='RIGHTHALF grid grid-cols-1'>
            
            </div>
        </div>
    </div>
  );
}