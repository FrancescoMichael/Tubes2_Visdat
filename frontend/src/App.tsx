import type { ChartData } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import DropdownCard from './components/DropdownCard'
import DonutChartCard from './components/DonutChartCard'
import LineChartCard from './components/LineChartCard'
import TableCard from './components/TableCard'
import StatCard from './components/StatCard'
import "./assets/fonts/Formula1-Regular_web_0.ttf";
import bannerRed from "./assets/banner-red.png";
import { useState, useEffect } from 'react'
import useFetch from './hooks/useFetch'



const chartData1: ChartData<'doughnut'> = {
  labels: ['Red Bull Racing', 'McLaren', 'Ferrari', 'Mercedes'],
  datasets: [
    {
      data: [8, 5, 4, 3],
      backgroundColor: ['#1E41FF', '#FF8700', '#DC0000', '#00D2BE'],
      hoverOffset: 10
    }
  ]
};

const chartOptions1: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const chartData2: ChartData<'doughnut'> = {
  labels: [
    'Max Verstappen',
    'Lando Norris',
    'Charles Leclerc',
    'Lewis Hamilton',
    'Oscar Piastri',
    'Carlos Sainz',
    'George Russell'
  ],
  datasets: [
    {
      data: [9, 4, 3, 2, 2, 2, 2],
      backgroundColor: [
        '#1E41FF', // Red Bull Racing
        '#FF8700', // McLaren
        '#DC0000', // Ferrari
        '#00D2BE', // Mercedes
        '#FF8700', // McLaren
        '#DC0000', // Ferrari
        '#00D2BE'  // Mercedes
      ],
      hoverOffset: 10
    }
  ]
};

const chartOptions2: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const lineChartData: ChartData<'line'> = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
  datasets: [
    {
      label: 'Progressive Data',
      data: [5, 7, 9, 8, 12, 15, 14, 18, 22, 21, 25, 28, 27, 31, 35, 33, 38, 42, 41, 45],
      borderColor: '#1E41FF',
      backgroundColor: 'rgba(30, 65, 255, 0.1)',
      tension: 0.4,
      fill: false
    }
  ]
}

const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const columns = ['Position', 'Driver', 'Points']
// const data = [
//     [1, 'Max Verstappen', 369],
//     [2, 'Lewis Hamilton', 305],
//     [3, 'Charles Leclerc', 279]
// ]

interface DriverStanding {
  code: string;
  driver_name: string;
  rank: number;
  team_name: string;
  total_points: number;
  wins: number;
}

interface ConstructorStanding {
  nationality: string;
  rank: number;
  team_name: string;
  total_points: number;
  wins: number;
}

interface StandingsResponse {
  constructors_championship: {
    standings: ConstructorStanding[];
    title: string;
  };
  drivers_championship: {
    standings: DriverStanding[];
    title: string;
  };
  year: number;
}


function App() {
  const optionview = ['Drivers', 'Teams']
  const [selectedView, setSelectedView] = useState('Drivers')
  const [selectedYear, setSelectedYear] = useState('')
  const [urlStandings, setUrlStandings] = useState('http://localhost:5000/api/standings/2024')

  const { data: years, loading, error } = useFetch<string[]>('http://localhost:5000/api/years')
  const { data: standings, loading: loading1, error: error1 } = useFetch<StandingsResponse>(urlStandings)

  const getTableData = () => {
    if (!standings) return []
    
    if (selectedView === 'Drivers') {
      return standings.drivers_championship?.standings?.map(driver => [
        driver.rank,
        driver.driver_name,
        driver.total_points
      ]) || []
    } else {
      return standings.constructors_championship?.standings?.map(team => [
        team.rank,
        team.team_name,
        team.total_points
      ]) || []
    }
  }

  const tableTitle = selectedView === 'Drivers' ? 'Driver Championship' : 'Constructor Championship'
  
  // Update URL when selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      setUrlStandings(`http://localhost:5000/api/standings/${selectedYear}`)
    }
  }, [selectedYear])

  if (loading || loading1) return <p>Loading...</p>
  if (error) return <p>Error loading years: {error}</p>
  if (error1) return <p>Error loading standings: {error1}</p>
  if (!years) return <p>No years available</p>

  return (
    <div className="bg-white p-6">
      <div className="WRAPPER grid grid-cols-2 gap-4 w-full">
        
        <div className='LEFTHALF'>
          <div>
            <DropdownCard
              title="Select Year"
              options={years}
              selectedOption={selectedYear}
              onChange={setSelectedYear}
              headingFontFamily="Formula1Bold"
              dropdownFontFamily="Formula1"
            />
          </div>
          <div className='flex flex-row gap-2 justify-center items-center '>
            <div className="w-1/4 mt-2">
              <p style={{fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">Top Stats</p>
            </div>
            <div className="w-3/4">
              <img src={bannerRed} alt="Line Chart Icon" className="w-full" />
            </div>
          </div>
          <div className='OVERVIEWNUMBER grid gap-4 grid-cols-3'>
            <div>
              <StatCard value="150" label="Total Users" />
            </div>
            <div>
              <StatCard value="150" label="Total Users" />
            </div>
            <div>
              <StatCard value="150" label="Total Users" />
            </div>
          </div>

          <div className='LINECHART mt-4 grid grid-cols-1'>
            <LineChartCard 
              title="Driver Fights"
              chartData={lineChartData}
              chartOptions={lineChartOptions}
              headingFontFamily='Formula1Bold'
              legendFontFamily='Formula1Bold'
              fontFamily="Formula1"
            />
          </div>

        </div>

        <div className='RIGHTHALF grid grid-cols-1'>
           <DropdownCard
              title="Select Category"
              options={optionview}
              selectedOption={selectedView}
              onChange={setSelectedView}
              headingFontFamily="Formula1Bold"
              dropdownFontFamily="Formula1"
            />

          <TableCard title={tableTitle} columns={columns} data={getTableData()} headingFontFamily='Formula1Bold' columnFonts={['Formula1', 'Formula1', 'Formula1']} columnSizes={[14,16,14]}/>

          <div className='DONUTCHART mt-4 grid grid-cols-2 gap-4'>
            <DonutChartCard
              title="Win(s) by Driver"
              chartData={chartData1}
              chartOptions={chartOptions1}
            />
            <DonutChartCard
              title="Pole(s) by Driver"
              chartData={chartData2}
              chartOptions={chartOptions2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App