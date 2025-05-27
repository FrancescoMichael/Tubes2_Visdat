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
  headingFontFamily?: string
  legendFontFamily?: string
  fontFamily?: string
}

const DonutChartCard: React.FC<DonutChartCardProps> = ({
  title,
  chartData,
  chartOptions,
  headingFontFamily = 'Formula1Bold',
  legendFontFamily = 'Formula1',
  fontFamily = 'Formula1Bold'
}) => {
  const options: ChartOptions<'doughnut'> = {
    ...chartOptions,
    plugins: {
      ...chartOptions?.plugins,
      legend: {
        ...chartOptions?.plugins?.legend,
        labels: {
          ...chartOptions?.plugins?.legend?.labels,
          font: {
            family: legendFontFamily,
            ...(chartOptions?.plugins?.legend?.labels?.font || {})
          }
        }
      },
      tooltip: {
        ...chartOptions?.plugins?.tooltip,
        bodyFont: {
          family: fontFamily,
          ...(chartOptions?.plugins?.tooltip?.bodyFont || {})
        },
        titleFont: {
          family: fontFamily,
          ...(chartOptions?.plugins?.tooltip?.titleFont || {})
        }
      }
    }
  }

  return (
    <div className="bg-white">
      <div className="rounded-tr-2xl border-t-1 border-r-1 border-slate-300">
        <p style={{ fontFamily: headingFontFamily }} className="text-2xl font-bold mb-4 pt-2 pl-2">
          {title}
        </p>
      </div>
      <div className="p-4">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}

export default DonutChartCard
