import React, {Component} from 'react'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import housesrc from './assets/japanese_house_2.0.glb'
import {DataContext} from './Contexts/DataContext'
import { GUI } from 'dat.gui'
import {io} from 'socket.io-client'
import fire from './assets/fire.glb'
import ledroom from './assets/ledroom.glb'
import {SeverUrl} from './Contexts/constans.js'
import { gsap } from "gsap";
/*import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";*/


let scene,renderer,camera,controls;
let socket=io(SeverUrl)
let mixer,clock;
let settings = {
    'room1': false,
    'room2':false,
}
class House extends Component {
  static contextType=DataContext

  componentDidMount(){
    console.log(this.context.dataState.itensity)
    //scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );
    /*const loaderbackground = new THREE.TextureLoader();
    const texture = loaderbackground.load(
      'https://uploads-ssl.webflow.com/5e008677e65e063e42daedb6/5e0089c710bfa76ac89e8fa0_4af19592168414bf6aac4d17b0123d96.png',
      () => {
        this.cover( texture, window.innerWidth / window.innerHeight );
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = texture;
      });
*/
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

    //ground
    const planeSize = window.innerWidth;
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({color: '#2C3639'});
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.name='ground'
    mesh.castShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    mesh.position.y=-1;
    scene.add(mesh);

    //ob
    const loader = new GLTFLoader();

    loader.load( housesrc, function ( gltf ) {
   
    gltf.scene.traverse ( ( o ) => {
      if ( o.isMesh ) {

      o.material.opacity = 0.2;
      
      }
    } );

    gltf.scene.scale.set(10,10,10);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //nen
   
    
    //fire
    clock = new THREE.Clock();
    const loaderfire = new GLTFLoader();

    loaderfire.load( fire, function ( gltf ) {
    gltf.scene.scale.set(10,10,10);
    gltf.scene.position.set(61,25,5)
    gltf.scene.name="fire"
    scene.add(gltf.scene);
    
    mixer = new THREE.AnimationMixer( gltf.scene );
    
    gltf.animations.forEach( ( clip ) => {
      
        mixer.clipAction( clip ).play();
      
    } );

    }, undefined, function ( error ) {

      console.error( error );

    } );
    
    //led room tret
    const loadled1 = new GLTFLoader();

    loadled1.load( ledroom, function ( gltf ) {
    gltf.scene.position.set(-25,85,-130)
    gltf.scene.scale.set(10,10,10);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );
    
    //let room lau
    const loadled2 = new GLTFLoader();

    loadled2.load( ledroom, function ( gltf ) {
    gltf.scene.position.set(-25,157,-130)
    gltf.scene.scale.set(10,10,10);
    scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );



    // lights
    //itensity:  this.context.dataState.itensity
    


    /*const dirLight1 = new THREE.DirectionalLight( 0xffffff );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );*/

    const dirLight2 = new THREE.DirectionalLight( 0x002288 );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0xFFFFFF,0);
    ambientLight.name='light'
    scene.add( ambientLight );

    //light outsite

    const light1 = new THREE.PointLight('#FFF9A6', 1);
    light1.position.set(-54, 79, 12);
    light1.distance=1
    light1.name='led1'
    scene.add(light1);

    
    const light2 = new THREE.PointLight('#E491F2', 1.23);
    light2.position.set(129, 75, 10);
    light2.distance=1
    light2.name='led2'
    scene.add(light2);
    
    /*const helper = new THREE.PointLightHelper(light);
    scene.add(helper);*/

    const light3 = new THREE.PointLight(0xFFFFFF, 1);
    light3.position.set(99, 55, -60);
    light3.distance=1
    light3.name='led3'
    scene.add(light3);
    
    //light ngang 5.6
    
    const light4 = new THREE.RectAreaLight(0xFFFFFF,30, 20, 5.6);
    light4.position.set(79, 74, 31);
    light4.rotation.x = THREE.MathUtils.degToRad(-90);
    light4.name='light4'
    scene.add(light4);

    //light tron

    const light5= new THREE.SpotLight(0xFFFFFF, 1);
    light5.position.set(-1, 63, 155);
    light5.distance=1
    light5.target.position.set(254, 0, -500);
    light5.penumbra=1
    light5.name='light5'
    scene.add(light5);
    scene.add(light5.target);

    //light home
    const light6 = new THREE.PointLight(0xFFFFFF, 2);
    light6.position.set(1, 63, -110);
    light6.distance=0
    light6.castShadow = true;
    light6.name='ledhome1'
    scene.add(light6);

    //light home 2
    const light7 = new THREE.PointLight(0xFFFFFF, 2);
    light7.position.set(-32.4, 157, -132);
    light7.distance=0
    light7.castShadow = true;
    light7.name='ledhome2'
    scene.add(light7);

    
    // const helper = new THREE.PointLightHelper(light7);
    // scene.add(helper);



    //GUI controls
    /*class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }*/


    //gui controls
    const gui = new GUI();
    /*gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);*/
    /*gui.add(light, 'distance', 0, 40).onChange(this.updateLight(helper));*/
    
    // this.makeXYZGUI(gui, c.position, 'position');
    

    this.makeOnOff(gui,light6,light7,'led room');
    this.makeCamera(gui);
    
    

    //window
    this.animate()
    window.addEventListener( 'resize', this.onWindowResize );

    setTimeout(()=>{
      scene.getObjectByName('fire').visible=false
    },1000)
    
    
  }

  componentDidUpdate(prevProps,prevState) {
    const ob=scene.getObjectByName('light')
    scene.remove(ob)
    let itensity=this.context.dataState.itensity
    const ambientLight = new THREE.AmbientLight( 0xFFFFFF,itensity);
    ambientLight.name='light'
    scene.add( ambientLight );

    

    if(itensity>=0.5){
      scene.background = new THREE.Color( 0xFFFFFF );
      const light1=scene.getObjectByName('led1')
      light1.distance=1
      const light2=scene.getObjectByName('led2')
      light2.distance=1
      const light3=scene.getObjectByName('led3')
      light3.distance=1
      const light4=scene.getObjectByName('light4')
      light4.distance=0
      const light5=scene.getObjectByName('light5')
      light5.distance=1
    }else{
      scene.background = new THREE.Color( 0x222222 );
      const light1=scene.getObjectByName('led1')
      light1.distance=0
      const light2=scene.getObjectByName('led2')
      light2.distance=0
      const light3=scene.getObjectByName('led3')
      light3.distance=0
      const light4=scene.getObjectByName('light4')
      light4.distance=5.6
      const light5=scene.getObjectByName('light5')
      light5.distance=0
    }
    
    
    
  }

  cover=( texture, aspect )=> {

    var imageAspect = texture.image.width / texture.image.height ;

    if ( aspect < imageAspect ) {

        texture.matrix.setUvTransform( 0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5 );

    } else {

        texture.matrix.setUvTransform( 0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5 );

    }

  }

  makeXYZGUI=(gui, vector3, name, onChangeFn)=> {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -500, 500).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 500).onChange(onChangeFn);
    folder.add(vector3, 'z', -500, 500).onChange(onChangeFn);
    folder.open();

  }

  makeOnOff=(gui,object1,object2,name)=>{
    const folder = gui.addFolder(name);
    folder.add(object1,'visible').name('đèn trệt').onChange(()=>{
      gui.updateDisplay()
      socket.emit('sendmess',{
        'led1':object1.visible,
        'led2':object2.visible
      })
    })
    folder.add(object2,'visible').name('đèn lầu').onChange(()=>{
      gui.updateDisplay()
      socket.emit('sendmess',{
        'led1':object1.visible,
        'led2':object2.visible
      })
    })
    folder.open();
    
  }

  makeCamera=(gui)=>{
    const folder = gui.addFolder('camera');
    folder.add(settings,'room1').name('tầng trệt').onChange(()=>{
      gui.updateDisplay()
      if(settings.room1){
        gsap.to(camera.position, { duration: 2, ease: "power1.inOut",
            x: -88.07253827505924,
            y: 92.89327822510565,
            z: -184.19329526775198})
            controls.enabled=false;
      }else{

        gsap.to(camera.position, { duration: 2, ease: "power1.inOut",
            x: 400,
            y: 200,
            z: 0})
            controls.enabled=true;
      }
    })

    folder.add(settings,'room2').name('lầu 1').onChange(()=>{
      gui.updateDisplay()
      if(settings.room2){
        gsap.to(camera.position, { duration: 2, ease: "power1.inOut",
            x: 18.72009909083146,
            y: 163.32514936162806,
            z: -177.1221565580821})
            controls.enabled=false;
      }else{

        gsap.to(camera.position, { duration: 2, ease: "power1.inOut",
            x: 400,
            y: 200,
            z: 0})
            controls.enabled=true;
      }
    })
    folder.open();;
  }


   updateLight=(helper)=> {
      helper.update();
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
    controls.update();

    renderer.render( scene, camera )

  }
  



  render(){
    return(
      <div
        ref={mount =>{
          this.mount=mount
        }}
      />
      
    )
  }
}

export default House