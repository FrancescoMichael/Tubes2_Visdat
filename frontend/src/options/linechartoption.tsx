import type { ChartOptions } from 'chart.js';

export const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        afterLabel: function(context) {
          interface CustomDataset {
            positions?: number[];
            [key: string]: unknown;
          }
          const dataset = context.dataset as unknown as CustomDataset;
          const dataIndex = context.dataIndex;
          
          if (dataset.positions && dataset.positions[dataIndex]) {
            return `Position: ${dataset.positions[dataIndex]}`;
          }
          return '';
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}