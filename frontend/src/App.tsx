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
import type { PolesResponse, SummaryResponse, WinsResponse, YearsResponse } from './models/meta'
import type { ConstructorStanding, DriverStanding } from './models/standing'
import type { DriverJourneysResponse, ConstructorJourneyResponse } from './models/journey'
import { API_DRIVER_JOURNEYS, API_DRIVER_STANDINGS, API_STATS_POLES, API_STATS_SUMMARY, API_STATS_WINS, API_YEARS } from './constant'

const chartOptions1: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 9,
        },
      }
    }
  }
}

const chartOptions2: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 9,
        },
      }
    }
  }
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

function App() {
  const optionview = ['Drivers', 'Teams']
  const [selectedView, setSelectedView] = useState('Drivers')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [urlStandings, setUrlStandings] = useState(`${API_DRIVER_STANDINGS}/2024`)
  const [urlPoles, setUrlPoles] = useState(`${API_STATS_POLES}/drivers/2024`)
  const [urlWins, setUrlWins] = useState(`${API_STATS_WINS}/drivers/2024`)
  const [urlSummary, setUrlSummary] = useState(`${API_STATS_SUMMARY}/2024`)
  const [currentPage, setCurrentPage] = useState(1)
  const [urlJourneys, setUrlJourneys] = useState(`${API_DRIVER_JOURNEYS}/2024`)

  const { data: years, loading, error } = useFetch<YearsResponse>(`${API_YEARS}`)
  const { data: standings, loading: loading1, error: error1 } = useFetch<DriverStanding[] | ConstructorStanding[]>(urlStandings)
  const { data: polesData } = useFetch<PolesResponse>(urlPoles)
  const { data: winsData } = useFetch<WinsResponse>(urlWins)
  const { data: summaryData } = useFetch<SummaryResponse>(urlSummary)

  const getNumberofDrivers = (): number => {
    if (!summaryData || !summaryData){
      return 0
    }

    else{
      return summaryData.total_drivers
    }
  }

  const getNumberofTeams = (): number => {
    if (!summaryData || !summaryData){
      return 0
    }

    else{
      return summaryData.total_teams
    }
  }

  const getUniquePodiums = (): number => {
    if (!summaryData || !summaryData){
      return 0
    }

    
    else{
      return summaryData.unique_podium_finishers
    }
  }

  // const getUniquePoleSitters = (): number => {
  //   if (!summaryData || !summaryData){
  //     return 0
  //   }

  //   else{
  //     return summaryData.unique_pole_sitters
  //   }
  // }

  const getUniqueRaceWinners = (): number => {
    if (!summaryData || !summaryData){
      return 0
    }

    else{
      return summaryData.unique_race_winners
    }}

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

    console.log("Poles data: ", polesData)

    return {
      labels: polesData.stats.map(item => item.name),
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

    console.log("Win data: ", winsData)

    return {
      labels: winsData.stats.map(item => item.name),
      datasets: [{
        data: winsData.stats.map(item => item.wins),
        backgroundColor: winsData.stats.map(item => item.color),
      }]
    }
  }

  const {
    data: journeys,
    error: error2
  } = useFetch<DriverJourneysResponse | ConstructorJourneyResponse>(urlJourneys);

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
      ]) || []
    }
  }

  const getLineChartData = (selectedView: string): ChartData<'line'> => {
    if (!journeys) {
      return {
        labels: [],
        datasets: []
      }
    }
    
    if (selectedView === 'Drivers') {
      if ('drivers' in journeys && Array.isArray(journeys.drivers)) {
        const data = journeys.drivers.map(journey => ({
            label: journey.driver_name,
            data: journey.points_journey.map(point => point.cumulative_points),
            borderColor: journey.color,
            backgroundColor: 'rgba(30, 65, 255, 0.1)',
            tension: 0.4,
            fill: false
          }))

        return {
          labels: journeys.drivers[0]?.points_journey.map(point => point.race_name) || [],
          datasets: data
        }
      } else {
        return {
          labels: [],
          datasets: []
        }
      }
    } else {
      if ('constructors' in journeys && Array.isArray(journeys.constructors)) {
        const data = journeys.constructors.map(journey => ({
          label: journey.name,
          data: journey.points_journey.map(point => point.cumulative_points),
          borderColor: journey.color,
          backgroundColor: 'rgba(30, 65, 255, 0.1)',
          tension: 0.4,
          fill: false
        }))

        return {
          labels: journeys.constructors[0]?.points_journey.map(point => point.race_name) || [],
          datasets: data
        }
      } else {
        return {
          labels: [],
          datasets: []
        }
      }
    }
  }

  const tableTitle = selectedView === 'Drivers' ? 'Driver Standing' : 'Constructor Standing'

  useEffect(() => {
    if (selectedYear) {
      const standingsEndpoint = selectedView === 'Drivers' ? 'drivers' : 'constructors'
      setUrlStandings(`http://localhost:5000/api/standings/${standingsEndpoint}/${selectedYear}`)
      
      setUrlPoles(`http://localhost:5000/api/stats/poles/${standingsEndpoint}/${selectedYear}`)
      setUrlWins(`http://localhost:5000/api/stats/wins/${standingsEndpoint}/${selectedYear}`)
      setUrlSummary(`http://localhost:5000/api/stats/summary/${selectedYear}`)

      const journeysEndpoint = selectedView === 'Drivers' ? 'drivers' : 'constructors'
      setUrlJourneys(`http://localhost:5000/api/journeys/${journeysEndpoint}/${selectedYear}`)

      setCurrentPage(1)
    }
  }, [selectedYear, selectedView])

  if (loading || loading1) return <p>Loading...</p>
  if (error) return <p>Error loading years: {error}</p>
  if (error1) return <p>Error loading standings: {error1}</p>
  if (error2) return <p>Error loading journeys: {urlJourneys}</p>
  if (!years) return <p>No years available</p>

  return (
    <div className="bg-white">
      <div className="WRAPPER grid grid-cols-2 gap-4 w-full bg-red-600">
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
          <div className="">
            <DropdownCard
              title="Select Category"
              options={optionview}
              selectedOption={selectedView}
              onChange={setSelectedView}
              headingFontFamily="Formula1Bold"
              dropdownFontFamily="Formula1"
            />
          </div>
      </div>
      <div className="WRAPPER grid grid-cols-2 gap-8 w-full p-6 pt-2">
        <div className='LEFTHALF'>
          <div className='flex flex-row gap-2 justify-center items-center '>
            <div className="w-1/4 mt-2">
              <p style={{ fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">Top Stats</p>
            </div>
            <div className="w-3/4">
              <img src={bannerRed} alt="Line Chart Icon" className="w-full" />
            </div>
          </div>
          <div className='OVERVIEWNUMBER grid gap-4 grid-cols-4'>
            <div>
              <StatCard value={selectedView === 'Drivers' ? getNumberofDrivers().toString() : getNumberofTeams.toString()} label={`Total ${selectedView === 'Drivers' ? 'Drivers' : 'Teams'}`} />
            </div>
            <div>
              <StatCard value={getUniqueRaceWinners().toString()} label="Total Unique Winners" />
            </div>
            <div>
              <StatCard value={getUniquePodiums().toString()} label="Total Unique Podium" />
            </div>
            <div>
              <StatCard value={getUniquePodiums().toString()} label="Total Unique Pole" />
            </div>
          </div>

          <div className='LINECHART mt-2 grid grid-cols-1'>
            <LineChartCard
              title="Championship"
              chartData={getLineChartData(selectedView)}
              chartOptions={lineChartOptions}
              headingFontFamily='Formula1Bold'
              legendFontFamily='Formula1Bold'
              fontFamily="Formula1"
            />
          </div>

        </div>

        <div className='RIGHTHALF grid grid-cols-1'>
          <TableCard
            title={tableTitle}
            columns={columns}
            data={getTableData() ?? []}
            headingFontFamily='Formula1Bold'
            columnFonts={['Formula1', 'Formula1', 'Formula1']}
            columnSizes={[14, 16, 14]}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <div className='DONUTCHART mt-2 grid grid-cols-2 gap-4 h-fit'>
            <DonutChartCard
              title={`Pole(s) by ${selectedView === 'Drivers' ? 'Driver' : 'Team'}`}
              chartData={getPolesChartData()}
              chartOptions={chartOptions1}
            />
            <DonutChartCard
              title={`Win(s) by ${selectedView === 'Drivers' ? 'Driver' : 'Team'}`}
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