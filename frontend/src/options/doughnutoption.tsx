import type { ChartOptions } from 'chart.js';

export const doughnutoption: ChartOptions<'doughnut'> = {
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