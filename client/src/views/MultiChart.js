import React from 'react'
import { Line } from "react-chartjs-2";

import {Chart as ChartJS} from 'chart.js/auto'
const MultiChart=({chartData})=>{

	const op = {
			  responsive: true,
			  interaction: {
			    mode: 'index',
			    intersect: false,
			  },
			  stacked: false,
			  plugins: {
			    title: {
			      display: true,
			      text: 'Dự đoán mưa',
			    },
			  },
			  scales: {
			    y: {
			      type: 'linear',
			      display: true,
			      position: 'left',
			    },
			    y1: {
			      type: 'linear',
			      display: true,
			      position: 'right',
			      grid: {
			        drawOnChartArea: false,
			      },
			    },
			  },
			};


	return <Line data={chartData} options={op} />
}

export default MultiChart;