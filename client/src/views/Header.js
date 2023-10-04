import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import BarChart from './BarChart';
import LineChart from './LineChart';
import MultiChart from './MultiChart';
import React from "react";
import { useState,useEffect,useContext } from "react";
import axios from 'axios'
import {DataContext} from '../Contexts/DataContext'
import Card from 'react-bootstrap/Card';
import cool from '../assets/cloudy.gif'
import hot from '../assets/sunny.gif'
import cold from '../assets/cold.gif'
import humidity from '../assets/huminity.png'
import weather from '../assets/weather.gif'
import InnerHTML from 'dangerously-set-html-content'

const Header=()=>{
	//context
	const {dataState}=useContext(DataContext)

	
	const [Chart,setChart] = useState({labels:'',datasets:[]});
	const [ChartLine,setChartLine] = useState({labels:'',datasets:[]});
	const [Avg,setAvg]=useState({avgtemp:null,avgHumidity:null});
	const [Multi,setMulti]=useState({labels:'',datasets:[]});
	const loadchart = async ()=>{

		
		try{
			const rsp= await axios.post(`https://graph.facebook.com/v15.0/102082729219221/messages?recipient={'id':'100009388788143'}&messaging_type=RESPONSE&message={'text':'hello,world'}&access_token=EAAFFa3uJ2VkBADBDFCRuGcjsZCyEOYeYClFQY998GhLto1X9ke2bhSzZCkmbyIiTLbWc92R9LvBo0epVOc25Rp4neYBLSrO5PPlqTYqQHukZCne4fLZC7cYlxQerx16YVqbO5TvEhOYLSeqJmXUwkL6xNdze5DTgOdHwYqGcAATrdNGwLe3tewnTLnmHnnQUEQ7sFSp1ldXymgVkTz7Q`)
			console.log(rsp)

			const response = await axios.get(`https://iot-production-d410.up.railway.app/api/house/chart`)
			if(response.data.success){


				let arr=[];
				response.data.query.map((data)=>{
					if(data.nhietdo>34){
						arr.push("#FF8787")
					}else if(data.nhietdo<20){
						arr.push("#0D4C92")
					}else{
						arr.push("#BCCEF8")
						
					}
				})
				
				setChart({
							labels: response.data.query.map((data)=>new Intl.DateTimeFormat('en-US', { month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date(data.createdAt))),
					  		datasets: [
					  			{
					  				label:"nhiệt độ new",
					  				backgroundColor: arr,
					  				data: response.data.query.map((data)=>data.nhietdo),
					  			},
					  		]
						})

				setChartLine({
							labels: response.data.query.map((data)=>new Intl.DateTimeFormat('en-US', { month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date(data.createdAt))),
					  		datasets: [
					  			{
					  				fill: true,
					  				label:"độ ẩm",
					  				data: response.data.query.map((data)=>data.doam),
					  				borderColor: 'rgb(53, 162, 235)',
      								backgroundColor: 'rgba(53, 162, 235, 0.5)',
					  			},
					  		]
				})
				
				setMulti({
							labels: response.data.query.map((data)=>new Intl.DateTimeFormat('en-US', { month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date(data.createdAt))),
							datasets: [
							    {
							      label: 'Nhiệt độ',
							      data: response.data.query.map((data)=>data.nhietdo),
							      borderColor: 'rgb(255, 99, 132)',
							      backgroundColor: 'rgba(255, 99, 132, 0.5)',
							      yAxisID: 'y',
							    },
							    {
							      label: 'Độ ẩm',
							      data: response.data.query.map((data)=>data.doam),
							      borderColor: 'rgb(53, 162, 235)',
							      backgroundColor: 'rgba(53, 162, 235, 0.5)',
							      yAxisID: 'y1',
							    },
							  ]
				})



				setAvg({avgtemp:response.data.avg[0].avgTemp,avgHumidity:response.data.avg[0].avgHumidity});
			}
			
		}catch(error){
			console.log("error");
		}
	}

	useEffect(() => { 

		loadchart()
	},[dataState.temp])
	



	
	let picture;
	
	if(Avg.avgtemp>34){
		picture=(<Card.Img variant="top" src={hot} style={{width:'17rem',height:'9rem'}} className="rounded mx-auto d-block"/>)

	}else if(Avg.avgtemp<20){
		picture=(<Card.Img variant="top" src={cold} style={{width:'17rem',height:'9rem'}} className="rounded mx-auto d-block"/>)
	}else{
		picture=(<Card.Img variant="top" src={cool} style={{width:'17rem',height:'9rem'}} className="rounded mx-auto d-block"/>)
	}
	
	let rain;

	if((Avg.avgHumidity-Avg.avgtemp)<0){
		rain="Không có khả năng mưa";
	}else{
		rain="Khả năng có mưa: "+(Avg.avgHumidity-Avg.avgtemp).toLocaleString(undefined, {maximumFractionDigits:2})+" %";
	}


	const codeStr = `

	<!-- Messenger Plugin chat Code -->

    <!-- Your Plugin chat code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>

	  <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "102082729219221");
      chatbox.setAttribute("attribution", "biz_inbox");
    </script>

    <!-- Your SDK code -->
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId            : '357802913159513',
          xfbml            : true,
          version          : 'v15.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
	`

	

	return(
		<>
		<div className="Head">
		<Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
	        <div className="Head-left">
	        	<ListGroup>
		            <ListGroup.Item  variant="light" action href="#link1">
		              Nhiệt độ
		            </ListGroup.Item>
		            <ListGroup.Item  variant="light" action href="#link2">
		              Độ ẩm
		            </ListGroup.Item>
		            <ListGroup.Item  variant="light" action href="#link3">
		               Mưa
		            </ListGroup.Item>
	        	</ListGroup>
	        </div>
	        <div className="Head-right">  
	          	<Tab.Content>
		            <Tab.Pane eventKey="#link1">

			            <div className="chart_content">
			            	<div className="Temp_avg">
				            	<Card style={{ width: '20rem',height:'23rem' }}>
							      {picture}
							      <Card.Body>
							        <Card.Title>Nhiệt độ trung bình</Card.Title>
							        <Card.Text> 
							          {Avg.avgtemp} ℃
							        </Card.Text>
							        <Card.Text> 
							           <span style={{background:'#BCCEF8',marginRight:'1em'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							           <span>Mát Mẻ</span>
							        </Card.Text>
							        <Card.Text> 
							           	<span style={{background:'#0D4C92',marginRight:'1em'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							          	<span>Lạnh Lẽo</span>
							        </Card.Text>
							        <Card.Text> 
							          	<span style={{background:'#FF8787',marginRight:'1em'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							          	<span>Nóng Nực</span>
							        </Card.Text>
							      </Card.Body>
							    </Card>
			            		
			            	</div>
			             	<div className="chart">
			               		<BarChart chartData={Chart} />
			               	</div>
				        </div>

		            </Tab.Pane>
		            <Tab.Pane eventKey="#link2">
		              	<div className="chart_content">
		              		<div className="Temp_avg">
		              			<Card style={{ width: '20rem',height:'23rem' }}>
							      <Card.Img variant="top" src={humidity} style={{width:'16rem',height:'12rem'}} className="rounded mx-auto d-block"/>
							      <Card.Body>
							        <Card.Title>Độ ẩm trung bình</Card.Title>
							        <Card.Text> 
							          {Avg.avgHumidity} %
							        </Card.Text>
							        <Card.Text> 
							           <span style={{background:'rgb(53, 162, 235)',marginRight:'1em'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							           <span>Độ ẩm</span>
							        </Card.Text>
							        
							      </Card.Body>
							    </Card>
							</div>

			                <div className="chart">
								<LineChart chartData={ChartLine} />
			                </div>
		                </div>
		            </Tab.Pane>

		            <Tab.Pane eventKey="#link3">
		              	<div className="chart_content">
		              		<div className="Temp_avg">
		              			<Card style={{ width: '20rem',height:'23rem' }}>
							      <Card.Img variant="top" src={weather} style={{width:'16rem',height:'12rem'}} className="rounded mx-auto d-block"/>
							      <Card.Body>
							        <Card.Title>Dự đoán khả năng mưa</Card.Title>
							        <Card.Text> 
							          {rain}
							        </Card.Text>
							       
							        
							      </Card.Body>
							    </Card>
							</div>

			                <div className="chart">
								<MultiChart chartData={Multi} />
			                </div>
		                </div>
		            </Tab.Pane>
	            </Tab.Content>
	     	</div>
      	</Tab.Container>
        </div>
        <InnerHTML html={codeStr} />
		</>
	)
}

export default Header