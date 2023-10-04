import React, {Component} from 'react'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ob_table from './assets/old_table.glb'
import ob_chair from './assets/old_chair.glb'
import ob_laptop from './assets/laptop.glb'
import ob_fan from './assets/desk_fan.glb'
import ob_flower from './assets/flowers.glb'
import ob_sofa from './assets/sofa.glb'
import ob_window from './assets/window.glb'
import ob_picture from './assets/picture.glb'
import ob_lamp from './assets/wall_lamp.glb'
import ob_caythong from './assets/sapin_de_noel.glb'
import ob_giuong from './assets/bed_agape.glb'
import Image from 'react-bootstrap/Image'
import {DataContext} from './Contexts/DataContext'
import {io} from 'socket.io-client'
import {SeverUrl} from './Contexts/constans.js'
import { gsap } from "gsap";
import Button from 'react-bootstrap/Button';
import { BsPlusLg } from "react-icons/bs";
import { BsDashLg } from "react-icons/bs";
import { BsHouse } from "react-icons/bs";
import { BsWrench } from "react-icons/bs";
import { BsFillCameraReelsFill } from "react-icons/bs";
import ColorPicker from './Components/color'
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import $ from 'jquery';
import Form from 'react-bootstrap/Form';
/*import { Sky } from './script/Sky'*/

let socket=io(SeverUrl)
let scene,renderer,camera,controls;
let mixer,clock;
let mixerwindows,gltfwindow;
let ttfan,ttrain,ttitensity,ttlamp;
let dem=1;
let dem2=1;
let dem3=1;
/*let sun,sky,renderTarget,pmremGenerator;
let parameters;*/
class House extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      fan:false,
      light:false,
      rain:false,
      switch1:false,
      auto:false
    };
  }

  static contextType=DataContext

  componentDidMount(){
    
    //scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( "#d8d8d8" );




    //renderer
    renderer= new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild( renderer.domElement );

    //camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 200, 0 );

    //controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); 
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;


    //sky
/*
    sun = new THREE.Vector3();

    sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.0005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.7;
230/100
    parameters = {
      elevation: 0,
      azimuth: 100
    };
    
    pmremGenerator = new THREE.PMREMGenerator( renderer );
    

    this.updateSun()*/

    




    //ground
    const planeSize = window.innerWidth;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(10, 10);

    const planeGeo = new THREE.PlaneGeometry(planeSize/6, planeSize/5);
    const planeMat = new THREE.MeshPhongMaterial({map: texture});
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.name='ground'
    mesh.castShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    mesh.position.y=-1;
    scene.add(mesh);

    //plane left
    const size=window.innerWidth/6;
    const planeGeo1 = new THREE.PlaneGeometry(size, size/2);
    const planeMat1 = new THREE.MeshPhongMaterial({
      color: '#f2f2f2',
      flatShading: true,
      side: THREE.DoubleSide,
      opacity:0.8,
      transparent: true
    });
    const mesh1 = new THREE.Mesh(planeGeo1, planeMat1);
    mesh1.name='planeleft'
    
    mesh1.position.z=154;
    mesh1.position.y=63;
    scene.add(mesh1);

    //plane right
    const planeGeo2 = new THREE.PlaneGeometry(size, size/2);
    const planeMat2 = new THREE.MeshPhongMaterial({
      color: '#f2f2f2',
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const mesh2 = new THREE.Mesh(planeGeo2, planeMat2);
    mesh2.name='planeright'
    
    mesh2.position.z=-154;
    mesh2.position.y=63;
    scene.add(mesh2);

    //plane bottom
    const size2=window.innerWidth/5;
    const planeGeo3 = new THREE.PlaneGeometry(size2, size2/2-24);
    const planeMat3 = new THREE.MeshPhongMaterial({
      color: '#f2f2f2',
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const mesh3 = new THREE.Mesh(planeGeo3, planeMat3);
    mesh3.name='planeback'
    mesh3.rotation.y= Math.PI * -.5;
    mesh3.position.y=63;
    mesh3.position.x=-126;
    scene.add(mesh3);

    //plane top
    const planeMat4 = new THREE.MeshPhongMaterial({
      color: '#fbf1e0',
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const mesh4 = new THREE.Mesh(planeGeo, planeMat4);
    mesh4.name='planetop'
    mesh4.rotation.x = Math.PI * -.5;
    mesh4.position.y=127;
    scene.add(mesh4);

    //table ob
    const table = new GLTFLoader();

    table.load( ob_table, function ( gltf ) {
    gltf.scene.name="table"
    gltf.scene.position.set(-110,20.3,88.5718504528298)
    gltf.scene.scale.set(7,7,7);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //chair ob
    const chair = new GLTFLoader();

    chair.load( ob_chair, function ( gltf ) {
    gltf.scene.name="chair"
    gltf.scene.position.set(-80,19,88.5718504528298)
    gltf.scene.rotation.y = Math.PI * -.5;
    gltf.scene.scale.set(20,20,20);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //picture ob
    const picture = new GLTFLoader();

    picture.load( ob_picture, function ( gltf ) {
    gltf.scene.position.set(-125,60,70)
    gltf.scene.scale.set(50,50,50);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //lamp ob

    const lamp = new GLTFLoader();

    lamp.load( ob_lamp, function ( gltf ) {
    gltf.scene.position.set(-100,90,5)
    gltf.scene.scale.set(0.2,0.2,0.2);
    gltf.scene.rotation.y = -4.7;
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //light lamp
    const lightlamp = new THREE.PointLight('#ffffff', 0.6);
    lightlamp.position.set(-88,90,0.7);
    lightlamp.distance=0
    lightlamp.name='lightlamp'
    scene.add(lightlamp);
    // const helper = new THREE.PointLightHelper(lightlamp);
    // scene.add(helper);

    //laptop ob
    const laptop = new GLTFLoader();

    laptop.load( ob_laptop, function ( gltf ) {
    gltf.scene.position.set(-110,21,88.5718504528298)
    gltf.scene.rotation.y = Math.PI * .5;
    gltf.scene.scale.set(0.5,0.5,0.5);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //fan ob
    clock = new THREE.Clock();
    const fan = new GLTFLoader();

    fan.load( ob_fan, function ( gltf ) {
    gltf.scene.scale.set(10,10,10);
    gltf.scene.position.set(-110,0,50)
    gltf.scene.rotation.y=-100;
    gltf.scene.name="fan"

    scene.add(gltf.scene);
   
    mixer = new THREE.AnimationMixer( gltf.scene );
    
    gltf.animations.forEach( ( clip ) => {
      
        mixer.clipAction( clip ).play();
      
    } );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    // flowers ob
    const flowers = new GLTFLoader();

    flowers.load( ob_flower, function ( gltf ) {
    gltf.scene.position.set(-30,50,154.5)
    gltf.scene.scale.set(2,2,2);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //sofa ob
    const sofa = new GLTFLoader();

   sofa.load( ob_sofa, function ( gltf ) {
   gltf.scene.position.set(-150,0,0)
    gltf.scene.scale.set(50,50,50);
    gltf.scene.rotation.y = Math.PI * 1.5;
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );
    

   //cay thong
    const caythong = new GLTFLoader();

    caythong.load( ob_caythong, function ( gltf ) {
     gltf.scene.position.set(70,8,40)
    gltf.scene.scale.set(8,8,8);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //giuong  
    const giuong = new GLTFLoader();

    giuong.load( ob_giuong, function ( gltf ) {
    gltf.scene.position.set(-70,-2,-90)
    gltf.scene.scale.set(0.4,0.4,0.4);
    gltf.scene.rotation.y = Math.PI * -1;
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );



    //window ob

    
    const windows = new GLTFLoader();

    windows.load( ob_window, function ( gltf ) {
    gltfwindow=gltf
    gltf.scene.scale.set(10,10,10);
    gltf.scene.position.set(-30,50,160)
    
    gltf.scene.name="window"

    scene.add(gltf.scene);
   
    mixerwindows = new THREE.AnimationMixer( gltf.scene );
    
    gltf.animations.forEach( ( clip ) => {
        
        mixerwindows.clipAction( clip ).play();
      
    } );

    }, undefined, function ( error ) {

      console.error( error );

    } );
    //light map
    const ambientLight = new THREE.AmbientLight( 0xFFFFFF,1);
    ambientLight.name='light'
    scene.add( ambientLight );

    

    // const gui = new GUI();
    // this.makeXYZGUI(gui, lightlamp.position, 'position')

    //window
    this.animate()
    window.addEventListener( 'resize', this.onWindowResize );
    //

    this.changecolor(); 



  }


  componentDidUpdate(prevProps,prevState) {
    ttitensity=this.context.dataState.itensity
    ttfan=this.context.dataState.fan
    ttrain=this.context.dataState.rain
    ttlamp=this.context.dataState.lamp


    $(".nhietdo").html(this.context.dataState.temp)
    $(".doam").html(this.context.dataState.humidity  )
    if(ttitensity<=200){
      $(".anhsang").html("trời sắp tối");
    }else{
      $(".anhsang").html("trời sáng");
    }

    if(ttrain==="true"){
      $('.mua').html("trời đang mưa")
    }else{
      $('.mua').html("trời quang mây tạnh")
    }


    if(dem===0 && ttfan==="true"){
        this.fan_on();
        dem=1;
    }
    if(dem===1 && ttfan==="false"){
        this.fan_off();
        dem=0;
    }


    
    
    if(dem2===0 && ttrain==="true"){
        this.rain_off();
        dem2=1;
    }
    if(dem2===1 && ttrain==="false"){
        this.rain_on();
        dem2=0;
    }

    if(dem3===0 && ttlamp==="true"){
        this.light_on();
        dem3=1;
    }
    if(dem3===1 && ttlamp==="false"){
        this.light_off();
        dem3=0;
    }
    
  }


  onWindowResize=()=> {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }


  


  animate=()=> {
    requestAnimationFrame( this.animate );
    
    var delta = clock.getDelta();
    
    if ( mixer ) mixer.update( delta );

    
    
    

    this.changecolor()
    
  
    renderer.render( scene, camera )

  }


  makeXYZGUI=(gui, vector3, name, onChangeFn)=> {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -500, 500).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 500).onChange(onChangeFn);
    folder.add(vector3, 'z', -500, 500).onChange(onChangeFn);
    folder.open();

  }

/*  updateSun=()=> {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );

    if ( renderTarget !== undefined ) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene( sky );

    scene.environment = renderTarget.texture;

  }
*/


  changecolor=()=>{
    if(scene.getObjectByName("planeright").material.color.getHex()!==$('input[id="mau"]').val()){
      scene.getObjectByName("planeright").material.color.setHex($('input[id="mau"]').val());
      scene.getObjectByName("planeback").material.color.setHex($('input[id="mau"]').val());
      scene.getObjectByName("planetop").material.color.setHex($('input[id="mau"]').val());
      scene.getObjectByName("planeleft").material.color.setHex($('input[id="mau"]').val());
    }


  }


  buttonclick=()=>{
    if($('.left').hasClass('show')){
      $('.left').removeClass('show');
      $('.left').addClass('hidden');
      $('.left div').hide('slow/400/fast');
      this.setState({ active: true })
    }else{
      $('.left').addClass('show')
      $('.left').removeClass('hidden');
      $('.left div').show('slow/400/fast');
      this.setState({ active: false })
    }
    
  }

  leftclick=()=>{
    
    const left=scene.getObjectByName('planeleft');
    // left.metarial.material.color.setHex(0xff0000)  
    if(left.visible){
      left.visible=false;
    }else{
      left.visible=true;
    }
  }

  rightclick=()=>{
    const right=scene.getObjectByName('planeright');

    if(right.visible){
      right.visible=false;
    }else{
      right.visible=true;
    }
  }
  
  backclick=()=>{
    const back=scene.getObjectByName('planeback');

    if(back.visible){
      back.visible=false;
    }else{
      back.visible=true;
    }
  }
  
  topclick=()=>{
    const top=scene.getObjectByName('planetop');

    if(top.visible){
      top.visible=false;
    }else{
      top.visible=true;
    }
  }

  /*object_click=()=>{

    if(this.state.fan){
      this.setState({ fan: false })
      mixer.timeScale=0;
      
      socket.emit('sendmess',{
        'fan':this.state.fan
      })

    }else{
      this.setState({ fan: true })
      mixer.timeScale=1;
    
      socket.emit('sendmess',{
        'fan':this.state.fan
      })
    }

  }*/

//bat tat quat
  fan_on=()=>{
     this.setState({ fan: true })
      mixer.timeScale=1;
    
     const data={
        'rain':this.state.rain,
        'lamp':this.state.light,
        'fan':true,
        'auto':this.state.auto
      }
      socket.emit('sendmess',data)
  }

  fan_off=()=>{
     this.setState({ fan: false })
      mixer.timeScale=0;
      
     const data={
        'rain':this.state.rain,       
        'lamp':this.state.light,
        'fan':false,
        'auto':this.state.auto
      }
      socket.emit('sendmess',data)
  }


//auto
  automatic=()=>{
    if(this.state.auto){
      this.setState({ auto: false })
      const data={
        'lamp':this.state.light,
        'fan':this.state.fan,
        'auto':false
      }
      socket.emit('sendmess',data)
    }else{
      this.setState({ auto: true })

      const data={
        'lamp':this.state.light,
        'fan':this.state.fan,
        'auto':true
      }
      socket.emit('sendmess',data)
    }
  }




//anh sang
  /*light_click=()=>{
    if(this.state.light){
      this.setState({ light: false })
      scene.getObjectByName("lightlamp").distance=1;
    }else{
      this.setState({ light: true })
      scene.getObjectByName("lightlamp").distance=0;
    }

  }*/

  light_on=()=>{
      this.setState({ light: true })
      scene.getObjectByName("lightlamp").distance=0;
    
     // const data={
     //    'rain':this.state.rain,
     //    'lamp':true,
     //    'fan':this.state.fan,
     //    'auto':this.state.auto
     //  }
     //  socket.emit('sendmess',data)
  }

  light_off=()=>{
      this.setState({ light: false })
      scene.getObjectByName("lightlamp").distance=1;
      
     // const data={
     //    'rain':this.state.rain,
     //    'lamp':false,
     //    'fan':this.state.fan,
     //    'auto':this.state.auto
     //  }
     //  socket.emit('sendmess',data)
  }



//rain


  rain_off=()=>{
   
      this.setState({ rain: false })
       // var delta2 = clockwindows.getDelta();
       // if ( mixerwindows )   mixerwindows.update(3.9833999999761582);
      mixerwindows.stopAllAction();

      gltfwindow.animations.forEach( ( clip ) => {
      
          mixerwindows.clipAction( clip ).play();
        
      } );

      

      const data={
        'rain':false,
        'lamp':this.state.light,
        'fan':this.state.fan,
        'auto':this.state.auto
      }
      socket.emit('sendmess',data)
  }
  rain_on=()=>{ 
     
      this.setState({ rain: true })
      
      
       mixerwindows.update(2.128899999976158);

        
      const data={
        'rain':true,
        'lamp':this.state.light,
        'fan':this.state.fan,
        'auto':this.state.auto
      }
      socket.emit('sendmess',data)
  }

  
  handleSwitch1=()=>{
    if(this.state.switch1){
      this.setState({switch1: false})

      gsap.to(camera.position, { duration: 2, ease: "power1.inOut",
            x: 400,
            y: 200,
            z: 0})
      gsap.to(camera.rotation, { duration: 2, ease: "power1.inOut",
            x: -1.5707963267948966,
            y: 1.1318049113498438,
            z: 1.5707963267948966})
            controls.enabled=true;
    }else{
      this.setState({switch1: true})
      
      gsap.to(camera.position, { duration: 2, ease: "power1.inOut",
            x: -115.7082700341084,
            y: 58.88350463966311,
            z: 131.87945925773707})
      gsap.to(camera.rotation, { duration: 2, ease: "power1.inOut",
            x: -0.47241099856155244,
            y: -0.6061697317913756,
            z: -0.28329982709970714})
            controls.enabled=false;  
    }
  }

  render(){
    let auto
    if(this.state.auto){
      auto=(
        <>
        <Button onClick={this.automatic} variant="light" active={true}>web</Button>
        </>
      )
    }else{
      auto=(
        <>
        <Button onClick={this.automatic} variant="light" active={false}>Arduino</Button>
        </>
      )
    }
    

    let body
    if(this.state.fan){
      body=(
      <>
      <div style={{"height":"250px"}}>
        <Image
          fluid={true}
          src={"https://png.pngtree.com/png-clipart/20190614/original/pngtree-fan-cartoon-fan-midsummer-summer-png-image_3784724.jpg"} 
          className="photo"
        />
      </div>
      <div className="mb-2">
        <Button onClick={this.fan_on} style={{"marginRight": "1em"}}  variant="light"  active={true}>ON</Button>
        <Button onClick={this.fan_off}  variant="light" active={false}>OFF</Button>
      </div>
      </>
      )
    }else{
      body=(
      <>
      <div style={{"height":"250px"}}>
      <Image
        fluid={true}
        className="photo"
        src={"https://previews.123rf.com/images/magicleaf/magicleaf1912/magicleaf191201367/134926059-electric-fan-vector-icon-cartoon-vector-icon-isolated-on-white-background-electric-fan-.jpg"} 
      />
      </div>
      <div className="mb-2">
        <Button onClick={this.fan_on} style={{"marginRight": "1em"}} variant="light" active={false}>ON </Button>
        <Button onClick={this.fan_off}  variant="light" active={true}>OFF</Button>
      </div>
      </>
      )
    }
    

    let light
    if(this.state.light){
      light=(
      <>
      <div style={{"height":"250px"}}>
        <Image
          fluid={true}
          src={"https://cdn.pixabay.com/photo/2013/07/12/17/45/bulb-152383_1280.png"} 
          className="photo"
        />
      </div>
      <div className="mb-2">
        automatic messages
      </div>
      </>
      )
    }else{
      light=(
      <>
      <div style={{"height":"250px"}}>
      <Image
        fluid={true}
        className="photo"
        src={"https://cdn.pixabay.com/photo/2020/04/04/03/42/idea-5000693_1280.png"} 
      />
      </div>
      <div className="mb-2">
        automatic messages
      </div>
      </>
      )
    }
    

    let rain
    if(this.state.rain){
      rain=(
      <>
      <div style={{"height":"250px"}}>
        <Image
          fluid={true}
          src={"https://www.shutterstock.com/image-vector/open-window-cartoon-vector-illustration-260nw-158234942.jpg"} 
          className="photo"
        />
      </div>
      <div className="mb-2">
        <Button onClick={this.rain_on} style={{"marginRight": "1em"}}  variant="light"  active={true}>ON</Button>
        <Button onClick={this.rain_off} variant="light" active={false}>OFF</Button>
      </div>
      </>
      )
    }else{
      rain=(
      <>
      <div style={{"height":"250px"}}>
      <Image
        fluid={true}
        className="photo"
        src={"https://as1.ftcdn.net/v2/jpg/01/74/73/06/1000_F_174730684_C2u0KAlQiF3fI5mBy7zb7OSbsLea16D3.jpg"} 
      />
      </div>
      <div className="mb-2">
        <Button onClick={this.rain_on} style={{"marginRight": "1em"}} variant="light" active={false}>ON </Button>
        <Button onClick={this.rain_off} variant="light" active={true}>OFF</Button>
      </div>
      </>
      )
    }
                  
    return(
      <>
      <div className="menuleft">

      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <div className="sub-menu">
          <ListGroup>
            <ListGroup.Item variant="light" action href="#link1">
              <BsHouse />
            </ListGroup.Item>
            <ListGroup.Item variant="light" action href="#link2">
              <BsWrench />
            </ListGroup.Item>
            <ListGroup.Item variant="light" action href="#link3">
              <BsFillCameraReelsFill />
            </ListGroup.Item>
          </ListGroup>
          
          
        </div>
        <div className="sub-content">
          <Tab.Content>
            <Tab.Pane eventKey="#link1">

              <div className="header">
                Trạng thái cảm biến
              </div>
              
              <div className="mid">

                <div className="card">
                  <div className="top">
                    <Image
                      width={100}
                      fluid={true}
                      src={"https://stinsonair.com.au/wp-content/uploads/icon_smarthome.png"} 
                    />
                  </div>
                  <div className="bottom">Nhiệt độ: <span className="nhietdo">150</span> ℃</div>
                </div>

                <div className="card">
                  <div className="top">
                    <Image
                      width={100}
                      fluid={true}
                      src={"https://cdn4.vectorstock.com/i/1000x1000/99/53/gold-line-water-drop-icon-isolated-on-dark-blue-vector-36279953.jpg"} 
                    />
                  </div>
                  <div className="bottom">Độ ẩm: <span className="doam">150</span> %</div>
                </div>

                <div className="card">
                  <div className="top">
                    <Image
                      width={150}
                      fluid={true}
                      src={"https://st3.depositphotos.com/32171116/34087/v/450/depositphotos_340874598-stock-illustration-smart-home-related-icon-on.jpg"} 
                    />
                  </div>
                  <div className="bottom">Ánh sáng: <span className="anhsang">150</span></div>
                </div>

                <div className="card">
                  <div className="top">
                    <Image
                      width={130}
                      fluid={true}
                      src={"https://www.tylertexasweather.com/wcicons/47.png"} 
                    />
                  </div>
                  <div className="bottom">Mưa: <span className="mua">150</span></div>
                </div>

              </div>

            </Tab.Pane>
            <Tab.Pane eventKey="#link2">
              
               <div className="header">
                Điều khiển thiết bị
              </div>
              <div>
               Đặt trạng thái thiết bị {auto}
              </div>
              <div className="mid">
                
                <div>
                  {body}
                </div>
                <div>
                  {light}
                </div>
                <div>
                  {rain}
                </div>
                

              </div>
              
            </Tab.Pane>

            <Tab.Pane eventKey="#link3">
              
              <div className="header">
                Camera
              </div>
              
              <div className="mid">
                
                <div>
                  <Form.Check 
                    type="switch"
                    id="switch1"
                    label="Check this change camera 1"
                    defaultChecked={this.state.switch1}
                    onChange={this.handleSwitch1}
                  />
                </div>
                
                

              </div>
              
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
      </div>


      <div className="settings">
        <div className="left">
          <div>
            <Button className="rounded-circle" variant="light" size="sm" onClick={this.leftclick}>left</Button>
          </div>
          <div>
            <Button className="rounded-circle" variant="light" size="sm" onClick={this.rightclick}>right</Button>
          </div>
          <div>
            <Button className="rounded-circle" variant="light" size="sm" onClick={this.backclick}>back</Button>
          </div>
          <div>
            <Button className="rounded-circle" variant="light" size="sm" onClick={this.topclick}>sky</Button>
          </div>
  
        </div>

        <div className="right">
          <Button className="rounded-circle" variant="outline-primary" size="lg" onClick={this.buttonclick}>{this.state.active ? <BsPlusLg/> : <BsDashLg/> }</Button>
        </div>

      </div>
    
        <div className="color-picker">
            <ColorPicker />
            <p>change color</p>
        </div>
       
         
          
      <div
        ref={mount =>{
          this.mount=mount
        }}
      />
      </>
    )
  }
}

export default House