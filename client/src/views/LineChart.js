import React from 'react'
import { Line } from "react-chartjs-2";

import {Chart as ChartJS} from 'chart.js/auto'
const LineChart=({chartData})=>{

	const op={
		  responsive: true,
		  plugins: {
		    title: {
		      display: true,
		      text: 'Biểu đồ độ ẩm',
		    },
		  },
		}


	return <Line data={chartData} options={op} />
}

export default LineChart;