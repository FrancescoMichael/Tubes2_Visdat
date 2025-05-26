// src/components/LineChartCard.tsx
import { Line } from 'react-chartjs-2'
import bannerBlack from '../assets/banner-black.png'
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
      <div className='flex flex-row gap-2 justify-center items-center '>
        <div className="w-1/3 mt-2">
          <p style={{fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">{title}</p>
        </div>
        <div className="w-2/3">
          <img src={bannerBlack} alt="Line Chart Icon" className="w-full" />
        </div>
      </div>
      <div className='p-4'>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default LineChartCard