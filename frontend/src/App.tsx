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

const chartOptions1: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
    }
  }
}

const chartOptions2: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
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

interface YearsResponse {
  years: number[]
}

interface PolesResponse {
  stats: {
    color: string,
    driver_name: string,
    poles: number,
  }[]
}

interface WinsResponse {
  stats: {
    color: string,
    driver_name: string,
    wins: number,
  }[]
}

function App() {
  const optionview = ['Drivers', 'Teams']
  const [selectedView, setSelectedView] = useState('Drivers')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [urlStandings, setUrlStandings] = useState('http://localhost:5000/api/standings/drivers/2024')
  const [urlPoles, setUrlPoles] = useState('http://localhost:5000/api/stats/poles/2024')
  const [urlWins, setUrlWins] = useState('http://localhost:5000/api/stats/wins/2024')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: years, loading, error } = useFetch<YearsResponse>('http://localhost:5000/api/years')
  const { data: standings, loading: loading1, error: error1 } = useFetch<DriverStanding[] | ConstructorStanding[]>(urlStandings)
  const { data: polesData } = useFetch<PolesResponse>(urlPoles)
  const { data: winsData } = useFetch<WinsResponse>(urlWins)

  const getPolesChartData = (): ChartData<'doughnut'> => {
    if (!polesData || !polesData.stats || polesData.stats.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      }
    }

    return {
      labels: polesData.stats.map(item => item.driver_name),
      datasets: [{
        data: polesData.stats.map(item => item.poles),
        backgroundColor: polesData.stats.map(item => item.color),
      }]
    }
  }

  const getWinsChartData = (): ChartData<'doughnut'> => {
    if (!winsData || !winsData.stats || winsData.stats.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      }
    }

    console.log(winsData)

    return {
      labels: winsData.stats.map(item => item.driver_name),
      datasets: [{
        data: winsData.stats.map(item => item.wins),
        backgroundColor: winsData.stats.map(item => item.color),
      }]
    }
  }

  const getTableData = () => {
    if (!standings) return []

    if (selectedView === 'Drivers') {
      const drivers = standings as DriverStanding[]
      return drivers.map(driver => [
        driver.rank,
        driver.driver_name,
        driver.total_points
      ])
    } else if (selectedView === 'Teams') {
      const teams = standings as ConstructorStanding[]
      return teams.map(team => [
        team.rank,
        team.team_name,
        team.total_points
      ])
    }

    return []
  }

  const tableTitle = selectedView === 'Drivers' ? 'Driver Standing' : 'Constructor Standing'

  useEffect(() => {
    if (selectedYear || selectedView) {
      setUrlStandings(`http://localhost:5000/api/standings/${(selectedView == 'Drivers') ? "drivers" : "constructors"}/${selectedYear}`)
      setUrlPoles(`http://localhost:5000/api/stats/poles/${selectedYear}`)
      setUrlWins(`http://localhost:5000/api/stats/wins/${selectedYear}`)
      setCurrentPage(1)
    }
  }, [selectedYear, selectedView])

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
              options={years.years.map((year: number) => year.toString())}
              selectedOption={selectedYear}
              onChange={setSelectedYear}
              headingFontFamily="Formula1Bold"
              dropdownFontFamily="Formula1"
            />
          </div>
          <div className='flex flex-row gap-2 justify-center items-center '>
            <div className="w-1/4 mt-2">
              <p style={{ fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">Top Stats</p>
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
              title="Championship"
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

          <TableCard
            title={tableTitle}
            columns={columns}
            data={getTableData()}
            headingFontFamily='Formula1Bold'
            columnFonts={['Formula1', 'Formula1', 'Formula1']}
            columnSizes={[14, 16, 14]}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <div className='DONUTCHART mt-4 grid grid-cols-2 gap-4 h-fit'>
            <DonutChartCard
              title="Pole(s) by Driver"
              chartData={getPolesChartData()}
              chartOptions={chartOptions1}
            />
            <DonutChartCard
              title="Win(s) by Driver"
              chartData={getWinsChartData()}
              chartOptions={chartOptions2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App