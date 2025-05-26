import DonutChartCard from './components/DonutChartCard'
import type { ChartData } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import LineChartCard from './components/LineChartCard'
import TableCard from './components/TableCard'
import StatCard from './components/StatCard'
import "./assets/fonts/Formula1-Regular_web_0.ttf";

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

const columns = ['Name', 'Age', 'Country']
const data = [
  ['Alice', 25, 'USA'],
  ['Bob', 30, 'Canada'],
  ['Charlie', 22, 'UK']
]

function App() {
  return (
    <div className="bg-white p-6">
      <div style={{ color: "#1139b9", fontFamily: "RubikScribble" }} className="text-6xl">MAX VERSTAPPEN</div>
      <h1 className="font-light text-6xl">Manrope Light</h1>
      <h1 className="font-manrope font-bold">Manrope Bold</h1>
      <div className="WRAPPER grid grid-cols-2 gap-4 w-full">
        <div className='LEFTHALF'>
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
          <div className='DONUTCHART mt-4 grid grid-cols-2 gap-4'>
            <DonutChartCard
              title="Wins by Team"
              chartData={chartData1}
              chartOptions={chartOptions1}
            />
            <DonutChartCard
              title="Wins by Driver"
              chartData={chartData2}
              chartOptions={chartOptions2}
            />
          </div>
          <div className='LINECHART mt-4 grid grid-cols-1'>
            <LineChartCard 
              title="Linechar"
              chartData={lineChartData}
              chartOptions={lineChartOptions}
            />
          </div>
        </div>
        <div className='RIGHTHALF grid grid-cols-1'>
          <TableCard title="User Information" columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}

export default App