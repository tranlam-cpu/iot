import React from 'react'
import { Bar } from "react-chartjs-2";

import {Chart as ChartJS} from 'chart.js/auto'
const BarChart=({chartData})=>{

	const op={
		  responsive: true,
		  plugins: {
		    title: {
		      display: true,
		      text: 'Biểu đồ nhiệt độ',
		    },
		  },
		}


	return <Bar data={chartData} options={op} />
}

export default BarChart;