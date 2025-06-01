import type { ChartData } from 'chart.js'
import DonutChartCard from '../components/DonutChartCard'
import LineChartCard from '../components/LineChartCard'
import TableCard from '../components/TableCard'
import StatCard from '../components/StatCard'
import "../assets/fonts/Formula1-Regular_web_0.ttf";
import pattern from "../assets/pattern.png";
import bannerRed from "../assets/banner-red.png";
import { useState, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import type { DriverSummary, PolesResponse, SummaryResponse, TeamSummary, WinsResponse } from '../models/meta'
import type { ConstructorStanding, DriverStanding } from '../models/standing'
import type { DriverJourneysResponse, ConstructorJourneyResponse } from '../models/journey'
import { API_DRIVER_JOURNEYS, API_DRIVER_STANDINGS, API_STATS_POLES, API_STATS_SUMMARY, API_STATS_WINS } from '../constant'
import { doughnutoption } from '../options/doughnutoption'
import { lineChartOptions } from '../options/linechartoption'
import type { View1Props } from '../models/props'

export default function View1({ year, category }: View1Props) {
  const tableColumns = ['Position', 'Driver', 'Points']
  const [urlStandings, setUrlStandings] = useState(`${API_DRIVER_STANDINGS}/${year}`)
  const [urlPoles, setUrlPoles] = useState(`${API_STATS_POLES}/drivers/${year}`)
  const [urlWins, setUrlWins] = useState(`${API_STATS_WINS}/drivers/${year}`)
  const [urlSummary, setUrlSummary] = useState(`${API_STATS_SUMMARY}/${year}`)
  const [currentPage, setCurrentPage] = useState(1)
  const [urlJourneys, setUrlJourneys] = useState(`${API_DRIVER_JOURNEYS}/${year}`)

  const { data: standings, loading: loading1, error: error1 } = useFetch<DriverStanding[] | ConstructorStanding[]>(urlStandings)
  const { data: polesData } = useFetch<PolesResponse>(urlPoles)
  const { data: winsData } = useFetch<WinsResponse>(urlWins)
  const { data: summaryData } = useFetch<SummaryResponse>(urlSummary)

  const getSummaryDriver = (): DriverSummary => {
    if (!summaryData || !summaryData){
      return {
        total_drivers: 0,
        unique_driver_podium_finishers: 0,
        unique_driver_pole_sitters: 0,
        unique_driver_race_winners: 0,
      }
    }

    else{
      return summaryData.driver_summary
    }
  }

  const getSummaryTeam = (): TeamSummary => {
    if (!summaryData || !summaryData){
      return {
        total_teams: 0,
        unique_team_podium_finishers: 0,
        unique_team_pole_sitters: 0,
        unique_team_race_winners: 0,
      }
    }

    else{
      return summaryData.team_summary
    }
  }

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

    if (category === 'Drivers') {
      const drivers = standings as DriverStanding[]
      return drivers.map(driver => [
        driver.rank,
        driver.driver_name,
        driver.total_points
      ])
    } else if (category === 'Teams') {
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
            tension: 0.1,
            fill: false,
            positions: journey.points_journey.map(point => point.position)
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
          fill: false,
          positions: journey.points_journey.map(point => point.position)
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

  const tableTitle = category === 'Drivers' ? 'Driver Standing' : 'Constructor Standing'

  useEffect(() => {
    if (year) {
      const standingsEndpoint = category === 'Drivers' ? 'drivers' : 'constructors'
      setUrlStandings(`http://localhost:5000/api/standings/${standingsEndpoint}/${year}`)
      
      setUrlPoles(`http://localhost:5000/api/stats/poles/${standingsEndpoint}/${year}`)
      setUrlWins(`http://localhost:5000/api/stats/wins/${standingsEndpoint}/${year}`)
      setUrlSummary(`http://localhost:5000/api/stats/summary/${year}`)

      const journeysEndpoint = category === 'Drivers' ? 'drivers' : 'constructors'
      setUrlJourneys(`http://localhost:5000/api/journeys/${journeysEndpoint}/${year}`)

      setCurrentPage(1)
    }
  }, [year, category])

  if (loading1) return <p>Loading...</p>
  if (error1) return <p>Error loading standings: {error1}</p>
  if (error2) return <p>Error loading journeys: {urlJourneys}</p>

  return (
    <div className="bg-white">
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
          <div className="w-full mt-4 h-2 -z-10">
              <img 
                src={pattern} 
                alt="Line Chart Icon" 
                className="w-full h-24 object-cover object-center" 
              />
          </div>
          <div className='OVERVIEWNUMBER -mt-8 grid gap-4 grid-cols-4 z-10 p-2'>
            <div>
              <StatCard value={category === 'Drivers' ? getSummaryDriver().total_drivers.toString() : getSummaryTeam().total_teams.toString()} label={`Total ${category === 'Drivers' ? 'Drivers' : 'Teams'}`} />
            </div>
            <div>
              <StatCard value={category === 'Drivers' ? getSummaryDriver().unique_driver_race_winners.toString() : getSummaryTeam().unique_team_race_winners.toString()} label={`Unique Winner`} />
            </div>
            <div>
              <StatCard value={category === 'Drivers' ? getSummaryDriver().unique_driver_podium_finishers.toString() :  getSummaryTeam().unique_team_podium_finishers.toString()} label={`Unique Podium`} />
            </div>
            <div>
              <StatCard value={category === 'Drivers' ? getSummaryDriver().unique_driver_pole_sitters.toString() : getSummaryTeam().unique_team_pole_sitters.toString()} label={`Unique Pole`} />
            </div>
          </div>

          <div className='LINECHART mt-2 grid grid-cols-1'>
            <LineChartCard
              title="Championship"
              chartData={getLineChartData(category)}
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
            columns={tableColumns}
            data={getTableData() ?? []}
            headingFontFamily='Formula1Bold'
            columnFonts={['Formula1', 'Formula1', 'Formula1']}
            columnSizes={[14, 16, 14]}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <div className='DONUTCHART mt-2 grid grid-cols-2 gap-4 h-fit'>
            <DonutChartCard
              title={`Pole(s) by ${category === 'Drivers' ? 'Driver' : 'Team'}`}
              chartData={getPolesChartData()}
              chartOptions={doughnutoption}
            />
            <DonutChartCard
              title={`Win(s) by ${category === 'Drivers' ? 'Driver' : 'Team'}`}
              chartData={getWinsChartData()}
              chartOptions={doughnutoption}
            />
          </div>
        </div>
      </div>
    </div>
  )
}