// src/components/LineChartCard.tsx
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface LineChartCardProps {
  title: string
  chartData: ChartData<'line'>
  chartOptions?: ChartOptions<'line'>
}

const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  chartData,
  chartOptions
}) => {
  return (
    <div className="bg-white">
      <div className='rounded-tr-2xl border-t-1 border-r-1 border-slate-300'>
        <h2 className="text-2xl font-bold mb-4 pt-2 pl-2">{title}</h2>
      </div>
      <div className='p-4'>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default LineChartCard