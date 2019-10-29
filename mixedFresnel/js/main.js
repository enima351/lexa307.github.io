/*global THREE*/
/*global dat*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}


class Slider{
  constructor(selector){
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 60000 );//75
    this.scene.background= new THREE.Color(0x000000);
    this.renderer = this.selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl2', { alpha: false,antialias:true } ) } );})()  : new THREE.WebGLRenderer({antialias:true})
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.fShader = THREE.FresnelShader;
    this.font = null;
    this.fontLoaded = false;
    this.text = null;
    this.tCubes = [];
    this.sceneParams =
    {
      0:{
        x:-17204,
        y:1000,
        z:23876,
        uniformsOut:{cubeMap:"https://sun9-42.userapi.com/c855732/v855732160/10984b/aWY4Eky5vwA.jpg"},

      },
      1:{
        x:-7776,
        y:4346,
        z:11754,
        uniformsOut:{cubeMap:"https://sun9-70.userapi.com/c855732/v855732160/109854/RVSxzvO9I_o.jpg"},


      },
      2:{
        x:305,
        y:-1715,
        z:2999,
        uniformsOut:{cubeMap:"https://sun9-17.userapi.com/c855732/v855732160/10985d/LBfa_9y2vUk.jpg"},


      },
      3:{
        x:2999,
        y:-400,
        z:0,
        uniformsOut:{cubeMap:"https://sun9-18.userapi.com/c855732/v855732160/109870/V0qpul4MZkk.jpg"},


      },
      4:{
        x:305,
        y:1652,
        z:-2600,
        uniformsOut:{cubeMap:"https://sun9-45.userapi.com/c855732/v855732160/109879/HYxKdu987nk.jpg"},


      },
      5:{
        x:-4009,
        y:-3062,
        z:-7776,
        uniformsOut:{cubeMap:"https://sun9-6.userapi.com/c855732/v855732160/109882/6aMNvhoNyHU.jpg"},


      },
      6:{
        x:-7776,
        y:1600,
        z:-16531,
        uniformsOut:{cubeMap:"https://sun9-13.userapi.com/c855732/v855732160/109895/136rHHLvFzw.jpg"},


      },

    }; 
  this.LoadResource();


  
    
  }
  onWindowResize () {
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

  }
  
  changeImaage(){
    let image = document.createElement('img');
    image.src = window.URL.createObjectURL(this.ImgLoader.files[0]);
    let cbtx = new THREE.CubeTextureLoader().load([image.src,image.src,image.src,image.src,image.src,image.src]);
   
   
    //let N = prompt("enter index of sphere (0 - 6)");
     //if(parseInt(N,10)<7&&parseInt(N,10)>=0){
      this.text.material.uniforms.tCube.value = cbtx;
     //}

    
    
  }


  animate () {
    
	  requestAnimationFrame( this.animate.bind(this) );
     this.stats.begin();
     this.time += 0.001;
     for(let i=0;i<7;i++){

      this.arrB[i].material.uniforms.time.value = this.time;
      this.arrB[i].rotation.x+=0.001;
      
     }
     if(this.fontLoaded){
        this.text.material.uniforms.time.value = this.time;
     }
      
      //this.controls.update();
      this.composerScene.render(0.01);
      //this.renderer.render( this.scene, this.camera );
      this.stats.end();

  }
   generateGeometry(){
     let newGeometry = new THREE.TextBufferGeometry( 'About', {
      font: this.font,
      size: this.fontSettings.size,
      height: this.fontSettings.height,
      curveSegments: this.fontSettings.curveSegments,
      bevelEnabled: this.fontSettings.bevelEnabled,
      bevelThickness: this.fontSettings.bevelThickness,
      bevelSize: this.fontSettings.bevelSize,
      bevelOffset: this.fontSettings.bevelOffset,
      bevelSegments: this.fontSettings.bevelSegments
    } );
    
    let tmpMAterial = this.text.material;
    this.scene.remove(this.text);
    this.text = new THREE.Mesh(newGeometry,tmpMAterial);
    this.scene.add(this.text);
  }


  Init(){
    this.focus = new THREE.Vector3(2999,1000,23876);
    this.container;
    this.time = 18.95;
    this.index = 3;
    this.spheres = [];
    this.moving = false;
    this.last = null ;
  
    
    //this.OrbitFlag = true;
    this.settings = {
      reflectivity:0.5,
      metalness:0.5,
      progress: 1,
      animtime: 5,
      roughness:0.5,
      uWiggleScale:  0.140 ,
      uWiggleDisplacement: 10.995,
      uWiggleSpeed:  0.001 ,
      refractionRatio: 0.93,
      dispersionSamples: 30,
      dispersionBlendMultiplier:6,
      dispersion: 0.8,
      mRefractionRatio: 1.0,
      mFresnelBias: 1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
      bgcolor: "#"+ this.scene.background.getHexString ()
    }
    this.controlsParams = {
      OrbitControls: false,
      Target:this.scene.position
    }
    
    this.arrB = [];
    this.arrCurves = [];
    this.arrOrbits = [];

    this.fontSettings = {
    size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
    }
     
    
   
    this.ImgLoader = document.getElementById( 'imgLoader' );
    this.ImgLoader.addEventListener('change',bind(this.changeImaage,this), false);
    let statment = 0;
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );

    this.rtParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };
    this.filmParams = {
      noiseIntensity:0.35,
      scanlinesIntensity:0.025,
      scanlinesCount:648,
      grayscale:false
    }
    this.composerScene = new THREE.EffectComposer( this.renderer, new THREE.WebGLRenderTarget( window.innerWidth*2 , window.innerHeight*2 , this.rtParameters ) );
    this.effectFilm = new THREE.FilmPass( this.filmParams.noiseIntensity, this.filmParams.scanlinesIntensity, this.filmParams.scanlinesCount, this.filmParams.grayscale );
    this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.composerScene.addPass(this.renderPass);
    this.composerScene.addPass(this.effectFilm);
    

    

    this.raycaster= new THREE.Raycaster();
    //this.raycaster.far=1700;
    this.mouse = new THREE.Vector2();
    this.container.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );
    this.container.addEventListener( 'mousewheel', bind(this.mouseHandle, this), false);
	
	
    this.controls = new THREE.OrbitControls( this.camera );
    this.camera.position.z = 1642;
    this.camera.position.set( 7277,  634,  27);
    this.camera.lookAt(this.scene.position);
    this.controls.update();
    this.textPositions = [];
    this.inMenu =false;
    this.bigtestgeometry=new THREE.IcosahedronGeometry(500, 4);

    for(let i =0;i<7;i++){

      let meshBMaterial = new THREE.ShaderMaterial( 
        {
          defines: {
            DISPERSION_SAMPLES:50
          },
            uniforms: 			{
              "mRefractionRatio": { type: "f", value: 1.02 },
              "mFresnelBias": 	{ type: "f", value: 1.0 },
              "mFresnelPower": 	{ type: "f", value: 2.0 },
              "mFresnelScale": 	{ type: "f", value: 1.0 },
              "time": { type: 'f', value: 9.95 },
              "progress": { type: 'f', value: 1.0 },
              "uWiggleScale": { type: 'f', value: 0.140 },
              "uWiggleDisplacement": { type: 'f', value: 0.01 },
              "uWiggleSpeed": { type: 'f', value: 0.001 },
              "refractionRatio":{ type: 'f', value: 0.93 }, 
		          "dispersion": { type: 'f', value: 0.8 }, 
              "dispersionBlendMultiplier":{ type: 'f', value: 6.0 },
              "cameraPosition":{value:this.camera.position},
              "tCube": 			{ type: "t", value:this.sceneParams[i].uniformsOut.tCube, } //  textureCube }
            },
          vertexShader:   this.fShader.vertexShader,
          fragmentShader: this.fShader.fragmentShader
        }   );
      let meshB = new THREE.Mesh(this.bigtestgeometry,	meshBMaterial);
      meshBMaterial.maxScaleHover = meshBMaterial.uniforms.uWiggleScale.value+0.075;
      let x = Math.cos(2 * Math.PI * i / 7) * 6000 + 0;
      let y = Math.sin(2 * Math.PI * i / 7) * 6000 + 0;

      let OCurveStartVectot = new THREE.Vector3((Math.cos(2 * Math.PI * (i-0.1) / 7) * 7100 +0),meshB.position.y+300,(Math.sin(2 * Math.PI * (i-0.1) / 7) * 7100 +0));
      let OCurveControlVevtor = new THREE.Vector3((Math.cos(2 * Math.PI * i / 7) * 7100 + 0),meshB.position.y+300,(Math.sin(2 * Math.PI * i / 7) * 7100 + 0));
      let OCurveEndVector = new THREE.Vector3((Math.cos(2 * Math.PI * (i+0.1) / 7) * 7100 +0),meshB.position.y+300,(Math.sin(2 * Math.PI * (i+0.1) / 7) * 7100 +0));
      
      this.textPositions.push(new THREE.Vector3(Math.cos(2 * Math.PI * i / 7) * 8000,meshB.position.y+300, Math.sin(2 * Math.PI * i / 7) * 8000))
      //let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

      let LCurveControlVector = new THREE.Vector3((Math.cos(2 * Math.PI * (i+0.5) / 7) * 10000 + 0),meshB.position.y+300,(Math.sin(2 * Math.PI * (i+0.5) / 7) * 10000 + 0));
      this.arrOrbits.push(new THREE.QuadraticBezierCurve3(
        OCurveStartVectot,
        OCurveControlVevtor,
        OCurveEndVector
      ));
      // let points = this.arrOrbits[i].getPoints(50);
      // let geometry = new THREE.BufferGeometry().setFromPoints( points );
      // let curveObject = new THREE.Line( geometry, material );
      // this.scene.add(curveObject);
      this.arrCurves.push(LCurveControlVector);

      meshB.position.set(x,300,y);
      meshB.lookAt(this.scene.position);
     
      this.arrB.push(meshB);

      this.scene.add(meshB);

    }
   document.addEventListener('keydown', bind(function(event) {
      if(!this.moving&&event.key==' '){
        this.moving = true;
        if(!this.inMenu){
          this.inMenu = true;
          TweenMax.to(this.camera.rotation,1,{y:this.camera.rotation.y+Math.PI,onComplete:()=>{this.moving = false;}});
        }else{
          TweenMax.to(this.camera.rotation,1,{y:this.camera.rotation.y-Math.PI,onComplete:()=>{this.inMenu = false;this.moving = false;}});
        }
        
        
      }
  },this));
    this.controls.enabled = false;
    this.gui = new dat.GUI();
    this.gui.add(this.controlsParams,'OrbitControls').onChange(bind(function(value) {
      if(value){
        this.moving = true;
        this.controls.enabled = true;
      }else{
        this.controls.enabled = false;
        this.moving = false;
       // this.camera.position.set( 4125,  -500,  0);
       // this.camera.lookAt(this.scene.position);
        
      }
    
      
     },this));
     this.gui.add(this.controlsParams,'Target',['scene','0','1','2','3','4','5','6']).onChange(bind(function(value) {
      if(value=='scene'){
        this.controls.target.set(this.scene.position.x,this.scene.position.y,this.scene.position.z);
      }else{
        this.controls.target.set(this.sceneParams[value].x,this.sceneParams[value].y,this.sceneParams[value].z);
      }
        
     },this));

    this.gui.addColor( this.settings, 'bgcolor').onChange(bind(function(value) {
      this.scene.background = new THREE.Color (value);
     // console.log(this);
     },this));
    let f1 = this.gui.addFolder('Film params');
    f1.add(this.filmParams,'noiseIntensity',0,1,0.001).onChange(bind(function(value) {
      this.effectFilm.material.uniforms.nIntensity.value = value;
    },this));
    f1.add(this.filmParams,'scanlinesIntensity',0,1,0.001).onChange(bind(function(value) {
      this.effectFilm.material.uniforms.sIntensity.value = value;
    },this));
    f1.add(this.filmParams,'scanlinesCount',0,5000,1).onChange(bind(function(value) {
      this.effectFilm.material.uniforms.sCount.value = value;
    },this));
    f1.add(this.filmParams,'grayscale').onChange(bind(function(value) {
      this.effectFilm.material.uniforms.grayscale.value = value;
    },this));
    for(let i = 0; i<7; i++){
      this.arrB[i].material.uniforms.uWiggleScale.value = this.settings.uWiggleScale;
      this.arrB[i].material.uniforms.uWiggleDisplacement.value = this.settings.uWiggleDisplacement;
      this.arrB[i].material.uniforms.uWiggleSpeed.value = this.settings.uWiggleSpeed;

      this.arrB[i].material.uniforms.mRefractionRatio.value = this.settings.mRefractionRatio;
      this.arrB[i].material.uniforms.mFresnelBias.value = this.settings.mFresnelBias;
      this.arrB[i].material.uniforms.mFresnelPower.value = this.settings.mFresnelPower;
      this.arrB[i].material.uniforms.mFresnelScale.value = this.settings.mFresnelScale;
      this.arrB[i].material.uniforms.refractionRatio.value = this.settings.refractionRatio;
      this.arrB[i].material.uniforms.dispersion.value = this.settings.dispersion;
      this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = this.settings.dispersionBlendMultiplier;
      let f = this.gui.addFolder('params: '+(i+1));
      f.add(this.settings, 'refractionRatio', 0, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.refractionRatio.value = value;
      },this));
      
       f.add(this.settings, 'dispersionBlendMultiplier', 0, 50, 1).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = value;
      },this));
       f.add(this.settings, 'dispersion', 0, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.dispersion.value = value;
      },this));
       f.add(this.settings, 'progress', -5, 5, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.progress.value = value;
      },this));
       f.add(this.settings, 'uWiggleScale', 0.001, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.uWiggleScale.value = value;
      },this));
      //  f.add(this.settings, 'uWiggleDisplacement', 0.001, 30, 0.001).onChange(bind(function(value) {
      //   this.arrB[i].material.uniforms.uWiggleDisplacement.value = value;
      // },this));
       f.add(this.settings, 'uWiggleSpeed', 0.001, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.uWiggleSpeed.value = value;
      },this));
      let f0 = f.addFolder('position ' + (i+1));
      f0.add(this.arrB[i].position,'x',-30000,30000,1).onChange(bind(function(value) {
        this.arrB[i].position.x = value;
        },this));
      f0.add(this.arrB[i].position,'y',-30000,30000,1).onChange(bind(function(value) {
          this.arrB[i].position.y = value;
          },this));
      f0.add(this.arrB[i].position,'z',-30000,30000,1).onChange(bind(function(value) {
        this.arrB[i].position.z = value;
        },this));
      let f1 = f.addFolder('bubble ' + (i+1));


      f1.add(this.settings,'mRefractionRatio',0,1,0.001).onChange(bind(function(value) {
      this.arrB[i].material.uniforms.mRefractionRatio.value = value;
      },this));
      f1.add(this.settings,'mFresnelBias',0,1,0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.mFresnelBias.value = value;
      },this));
      f1.add(this.settings,'mFresnelPower',0,5,0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.mFresnelPower.value = value;
      },this));
      f1.add(this.settings,'mFresnelScale',0,1,0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.mFresnelScale.value = value;
 
      },this));

    }

    this.light = new THREE.PointLight(0xff0000, 0.8,500);
    this.light.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    this.scene.add(this.light);
    //TweenMax.to(this.material.uniforms.progress,5,{value:5,repeat:-1,yoyo:true});

window.addEventListener("resize",bind(this.onWindowResize,this), false);
this.animate();

  }

  LoadResource(){
    let resCounter = 0;
    
    for(let i in this.sceneParams){
      
      let url =  this.sceneParams[i].uniformsOut.cubeMap;
      this.sceneParams[i].uniformsOut.tCube = new THREE.CubeTextureLoader().load(
        [url,url,url,url,url,url],
         ()=>{
          
          resCounter++;
        }
      )
    }
    let loader = new THREE.FontLoader();

    let textmaterial = new THREE.ShaderMaterial( 
      {
        defines: {
          DISPERSION_SAMPLES:50
        },
          uniforms: 			{
            "mRefractionRatio": { type: "f", value: 1.02 },
            "mFresnelBias": 	{ type: "f", value: 1.0 },
            "mFresnelPower": 	{ type: "f", value: 2.0 },
            "mFresnelScale": 	{ type: "f", value: 1.0 },
            "time": { type: 'f', value: 9.95 },
            "progress": { type: 'f', value: 1.0 },
            "uWiggleScale": { type: 'f', value: 0.140 },
            "uWiggleDisplacement": { type: 'f', value: 0.01 },
            "uWiggleSpeed": { type: 'f', value: 0.001 },
            "refractionRatio":{ type: 'f', value: 0.93 }, 
            "dispersion": { type: 'f', value: 0.8 }, 
            "dispersionBlendMultiplier":{ type: 'f', value: 6.0 },
            "cameraPosition":{value:this.camera.position},
            "tCube": 			{ type: "t", value:new THREE.CubeTextureLoader()
            .load( [
                    "textures/cubemaps/Frame1.jpg",
                    "textures/cubemaps/Frame1.jpg",
                    "textures/cubemaps/Frame1.jpg",
                    "textures/cubemaps/Frame1.jpg",
                    "textures/cubemaps/Frame1.jpg",
                    "textures/cubemaps/Frame1.jpg"
            ],()=>{
              resCounter++;
            } ), } //  textureCube }
          },
        vertexShader:   this.fShader.vertexShader,
        fragmentShader: this.fShader.fragmentShader
      }   );
    loader.load( 'fonts/Wooland.json', bind(function ( font ) {
      this.font = font;
        let geometry = new THREE.TextBufferGeometry( 'About', {
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        } );
      
        
        this.text = new THREE.Mesh(geometry,textmaterial);
        this.text.name = 'text';
        //textMesh.position.set( 6498.349068563988,  1177.689926040678,  2585.312866564084);
        this.scene.add(this.text);
        this.fontLoaded = true;
        resCounter++;
      
      },this ));

let s;
s = setInterval(()=>{
  if(resCounter==9){
    clearInterval(s);
    this.Init();
    
  }else{
    console.log(resCounter)
  }
},100)
    
  
  }
  
    onMouseMove ( event ) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera( this.mouse, this.camera );

      if(!this.moving&&!this.inMenu){
        TweenMax.to(this.camera.position,1,{ease: Power2.easeOut,x:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.1).x,z:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.1).z,y:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.1).y,onUpdate:()=>{this.camera.lookAt(this.scene.position);}});
      }
      
  
	// calculate objects intersecting the picking ray
  var intersects = this.raycaster.intersectObjects(this.scene.children );
 
  if(intersects.length == 0){
    
    if(this.last!=null){
      TweenMax.to(this.last.uniforms.dispersion,2,{value:0.8,ease: Power2.easeOut});
      TweenMax.to(this.last.uniforms.refractionRatio,2,{value:0.93,ease: Power2.easeOut});
      const tmpConst = this.last.maxScaleHover-0.075;
      TweenMax.to(this.last.uniforms.uWiggleScale,2,{value:tmpConst,ease: Power2.easeInOut,onComplete:()=>{}});

      this.last = null;
      
    }
  }
  if(intersects.length>0&&intersects[ 0 ].object.name!='text'){
    
    if(this.last!=null&&this.last.uuid!=intersects[ 0 ].object.material.uuid){
     // console.log('y2')
      TweenMax.to(this.last.uniforms.dispersion,2,{value:0.8,ease: Power2.easeInOut});
            TweenMax.to(this.last.uniforms.refractionRatio,2,{value:0.93,ease: Power2.easeOut});
      const tmpConstP = this.last.maxScaleHover-0.075;
      TweenMax.to(this.last.uniforms.uWiggleScale,2,{value:tmpConstP,ease: Power2.easeInOut,onComplete:()=>{ }})
      this.last = intersects[ 0 ].object.material
      TweenMax.to(intersects[ 0 ].object.material.uniforms.dispersion,2,{value:1,ease: Power2.easeInOut});
      TweenMax.to(intersects[ 0 ].object.material.uniforms.refractionRatio,2,{value:1,ease: Power2.easeOut});
      const tmpConstM = intersects[ 0 ].object.material.maxScaleHover;
      TweenMax.to(intersects[ 0 ].object.material.uniforms.uWiggleScale,2,{value:tmpConstM,ease: Power2.easeInOut})
    }
    if(this.last==null){
     // console.log(intersects[0])
      this.last = intersects[ 0 ].object.material;
      TweenMax.to(intersects[ 0 ].object.material.uniforms.dispersion,2,{value:1,ease: Power2.easeInOut});
      TweenMax.to(intersects[ 0 ].object.material.uniforms.refractionRatio,2,{value:1,ease: Power2.easeOut});
      TweenMax.to(intersects[ 0 ].object.material.uniforms.uWiggleScale,2,{value:intersects[ 0 ].object.material.maxScaleHover,ease: Power2.easeInOut})
    }


    

    
  }

	    
    }

    mouseHandle(event){
      if(!this.moving){
        if(event.deltaY==100){
 		
          this.indexControl('next');
        }else{
          this.indexControl('back');
        }
      }
      
    }

    indexControl(direction){
      if(!this.inMenu){
        let floatIndex = {value:0};
      let materialChanged = false;
      if(direction == 'next' && this.index<this.arrOrbits.length-1){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.index],
          new THREE.Vector3( this.arrOrbits[this.index+1].getPointAt(0.5).x,  this.arrOrbits[this.index+1].getPointAt(0.5).y,  this.arrOrbits[this.index+1].getPointAt(0.5).z )
        );

       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index+1].position.x,y:this.arrB[this.index+1].position.y,z:this.arrB[this.index+1].position.z,onUpdate:()=>{}})
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index++;
          this.moving = false;
          this.text.position.set(this.textPositions[this.index].x,this.textPositions[this.index].y,this.textPositions[this.index].z);
          this.text.lookAt(this.scene.position)},
          
        onUpdate:()=>{
          this.camera.lookAt(this.scene.position);
          
          this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=this.index+1&&i!=this.index+2&&i!=this.index){
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});

              } 

            }
            if(this.index==this.arrB.length-2){
              TweenMax.to(this.arrB[this.index+1].material.uniforms.dispersionBlendMultiplier,1,{value:6});
              TweenMax.to(this.arrB[0].material.uniforms.dispersionBlendMultiplier,1,{value:4});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            }else{
              TweenMax.to(this.arrB[this.index+1].material.uniforms.dispersionBlendMultiplier,1,{value:6});
              TweenMax.to(this.arrB[this.index+2].material.uniforms.dispersionBlendMultiplier,1,{value:4});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            }
            
            materialChanged = true;
          }
        }
      if(direction == 'back' && this.index>0){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.index-1],
          new THREE.Vector3( this.arrOrbits[this.index-1].getPointAt(0.5).x,  this.arrOrbits[this.index-1].getPointAt(0.5).y,  this.arrOrbits[this.index-1].getPointAt(0.5).z )
        );
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index-1].position.x,y:this.arrB[this.index-1].position.y,z:this.arrB[this.index-1].position.z,onUpdate:()=>{}})
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index--;
          this.moving = false;
          this.text.position.set(this.textPositions[this.index].x,this.textPositions[this.index].y,this.textPositions[this.index].z);
          this.text.lookAt(this.scene.position)},
        onUpdate:()=>{
          this.camera.lookAt(this.scene.position);
          this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=this.index-1&&i!=this.index-2&&i!=this.index){
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});
              } 

            }
            if(this.index==1){
              TweenMax.to(this.arrB[this.index-1].material.uniforms.dispersionBlendMultiplier,1,{value:6});
              TweenMax.to(this.arrB[this.arrB.length-1].material.uniforms.dispersionBlendMultiplier,1,{value:4});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            }else{
              TweenMax.to(this.arrB[this.index-1].material.uniforms.dispersionBlendMultiplier,1,{value:6});
              TweenMax.to(this.arrB[this.index-2].material.uniforms.dispersionBlendMultiplier,1,{value:4});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            }
            
            materialChanged = true;
          }
          
          // let material = new THREE.LineBasicMaterial( { color : 0x0000ff } );
        // let points = curve.getPoints(50);
        // let geometry = new THREE.BufferGeometry().setFromPoints( points );
        // let curveObject = new THREE.Line( geometry, material );
        // this.scene.add(curveObject);
      }

      if(direction == 'next' && this.index==this.arrOrbits.length-1){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.index],
          new THREE.Vector3( this.arrOrbits[0].getPointAt(0.5).x,  this.arrOrbits[0].getPointAt(0.5).y,  this.arrOrbits[0].getPointAt(0.5).z )
        );
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index+1].position.x,y:this.arrB[this.index+1].position.y,z:this.arrB[this.index+1].position.z,onUpdate:()=>{}})
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index=0;
          this.moving = false;
          this.text.position.set(this.textPositions[this.index].x,this.textPositions[this.index].y,this.textPositions[this.index].z);
          this.text.lookAt(this.scene.position)},
        onUpdate:()=>{
          this.camera.lookAt(this.scene.position);
          this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=0&&i!=this.index&&i!=1){
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});
              } 

            }
            TweenMax.to(this.arrB[0].material.uniforms.dispersionBlendMultiplier,1,{value:6});
            TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            TweenMax.to(this.arrB[1].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            materialChanged = true;
          }
        }
      if(direction == 'back' && this.index==0){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.cameraGroup.position.x,  this.cameraGroup.position.y,  this.cameraGroup.position.z),
          this.arrCurves[this.arrOrbits.length-1],
          new THREE.Vector3( this.arrOrbits[this.arrOrbits.length-1].getPointAt(0.5).x,  this.arrOrbits[this.arrOrbits.length-1].getPointAt(0.5).y,  this.arrOrbits[this.arrOrbits.length-1].getPointAt(0.5).z )
        );
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index-1].position.x,y:this.arrB[this.index-1].position.y,z:this.arrB[this.index-1].position.z,onUpdate:()=>{}})
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index=this.arrOrbits.length-1;
          this.moving = false;
          this.text.position.set(this.textPositions[this.index].x,this.textPositions[this.index].y,this.textPositions[this.index].z);
          this.text.lookAt(this.scene.position)
        },onUpdate:()=>{this.camera.lookAt(this.scene.position);this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=this.arrB.length-1){
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});
              } 

            }
            TweenMax.to(this.arrB[this.arrB.length-1].material.uniforms.dispersionBlendMultiplier,1,{value:6});
            TweenMax.to(this.arrB[0].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            TweenMax.to(this.arrB[this.arrB.length-2].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            materialChanged = true;
          }
        }
      }
      

    }
    focusMaterial(){
      for(let i = 0; i<this.arrB.length;i++){
        if(i!=this.index){

          //TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:4});
        }
        
      }


    }
  
  
}
if ( THREE.WEBGL.isWebGLAvailable() ) {
  //var canvas = document.createElement( 'canvas' );
	// Initiate function or other initializations here
	let a = new Slider(/*canvas*/);

} else {

	var warning = THREE.WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}