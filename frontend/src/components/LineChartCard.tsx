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
  headingFontFamily?: string
  legendFontFamily?: string
  fontFamily?: string
  xAxisFontSize?: number
  yAxisFontSize?: number
}

const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  chartData,
  chartOptions,
  headingFontFamily = 'Formula1Bold',
  legendFontFamily = 'Formula1Bold',
  fontFamily = 'Formula1Bold',
  xAxisFontSize = 10,
  yAxisFontSize = 12
}) => {
  const options: ChartOptions<'line'> = {
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
      },
      title: {
        ...chartOptions?.plugins?.title,
        font: {
          family: fontFamily,
          ...(chartOptions?.plugins?.title?.font || {})
        }
      }
    },
    scales: {
      x: {
        ...chartOptions?.scales?.x,
        ticks: {
          font: {
            family: fontFamily,
            size: xAxisFontSize
          },
          ...chartOptions?.scales?.x?.ticks
        },
        title: {
          ...chartOptions?.scales?.x?.title,
          font: {
            family: fontFamily,
            size: xAxisFontSize + 2 // Title sedikit lebih besar dari ticks
          }
        }
      },
      y: {
        ...chartOptions?.scales?.y,
        ticks: {
          font: {
            family: fontFamily,
            size: yAxisFontSize
          },
          ...chartOptions?.scales?.y?.ticks
        },
        title: {
          ...chartOptions?.scales?.y?.title,
          font: {
            family: fontFamily,
            size: yAxisFontSize + 2 // Title sedikit lebih besar dari ticks
          }
        }
      }
    }
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className="w-1/3 mt-2">
          <p style={{ fontFamily: headingFontFamily }} className="text-2xl font-bold mb-4 pt-2 pl-2">
            {title}
          </p>
        </div>
        <div className="w-2/3">
          <img src={bannerBlack} alt="Line Chart Icon" className="w-full" />
        </div>
      </div>
      <div className="p-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default LineChartCard