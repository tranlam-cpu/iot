import React, {Component} from 'react'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DataContext} from './Contexts/DataContext'
import water_texture from './assets/waternormals.jpg'
import { Sky } from './script/Sky'
import { Water } from './script/Water'




let scene,renderer,camera,controls;
let sun,sky,water,renderTarget,pmremGenerator;
let parameters;
let itensity;
class Dashboard extends Component {


	static contextType=DataContext

 	componentDidMount(){

 	//renderer
 	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	this.mount.appendChild( renderer.domElement );

	//Scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.position.set( 30, 30, 100 );

	//sun
	sun = new THREE.Vector3();

	//water
	const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
	water = new Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( water_texture, function ( texture ) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			} ),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;
	scene.add( water );

	//sky
	sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.0005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.7;
/*230/180*/
    parameters = {
      elevation: 0,
      azimuth: 180
    };
    
    pmremGenerator = new THREE.PMREMGenerator( renderer );
    

    this.updateSun()

    //controls
    controls = new OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.target.set( 0, 10, 0 );
	controls.minDistance = 40.0;
	controls.maxDistance = 200.0;
	controls.update();





	//window
    this.animate()
    window.addEventListener( 'resize', this.onWindowResize );

    /*controls.enabled=false;*/
 	}


 	componentDidUpdate(prevProps,prevState) {
    itensity=this.context.dataState.itensity;
    if(itensity<=50){
    	parameters.azimuth=10
    	parameters.elevation=0
    	this.updateSun();
    }
    if(itensity>50 && itensity<=130){
    	parameters.azimuth=180
    	parameters.elevation=2
    	this.updateSun();
    }
    if(itensity >130 && itensity <=200){
    	parameters.azimuth=180
    	parameters.elevation=4
    	this.updateSun();
    }
    if(itensity >200 && itensity <=300){
    	parameters.azimuth=180
    	parameters.elevation=6
    	this.updateSun();
    }
    if(itensity>300){
    	parameters.azimuth=180
    	parameters.elevation=10
    	this.updateSun();
    }
  }


	updateSun=()=> {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene( sky );

    scene.environment = renderTarget.texture;

	}


	onWindowResize=()=> {
    
		camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();

	    renderer.setSize( window.innerWidth, window.innerHeight );

	}


  


  	animate=()=> {
	    requestAnimationFrame( this.animate );
		
		

			water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

	    renderer.render( scene, camera )

  	}



  	render(){
  		return(		
  			<div
  				className="ob_dashboard"
        		ref={mount =>{
	          	this.mount=mount
	        	}}
	      	/>
    	)

	}
}

export default Dashboard