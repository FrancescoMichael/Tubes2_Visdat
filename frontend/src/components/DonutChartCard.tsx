// src/components/DonutChartCard.tsx
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartCardProps {
  title: string
  chartData: ChartData<'doughnut'>
  chartOptions?: ChartOptions<'doughnut'>
}

const DonutChartCard: React.FC<DonutChartCardProps> = ({
  title,
  chartData,
  chartOptions
}) => {
  return (
    <div className="bg-white">
      <div className='rounded-tr-2xl border-t-1 border-r-1 border-slate-300'>
        <p style={{fontFamily: "Formula1Bold" }} className="text-2xl font-bold mb-4 pt-2 pl-2">{title}</p>
      </div>
      <div className='p-4'>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default DonutChartCard
