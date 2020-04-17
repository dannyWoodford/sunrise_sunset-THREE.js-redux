let container, stats, gui;
let camera, scene, renderer, light, amblight, dirLight, sun, circleGeo, circleMat, composer, stars, flickerStars, nightSky
let controls, cubeCamera, uniforms, sky, water, loader, dracoLoader, logo, moon, moonMaterial, time ,inclination, parameters;
let cloudParticle = []
let clock = new THREE.Clock();
let body = document.querySelector('body')



	function init() {
            // Get canvas
				container = document.getElementById( 'container' );

			// Create renderer
				renderer = new THREE.WebGLRenderer({antialias: true});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( renderer.domElement );
                
                // Create scene
                scene = new THREE.Scene();

			// Create camera
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .01, 20000 );
                camera.position.set(40, 35, 140 );
                camera.layers.enable( 0 ); // enabled by default
                camera.layers.enable( 1 ); // logo and sun
				camera.layers.disable( 2 ); // stars
				camera.layers.disable( 3 ); // clouds

			// Create lights
				amblight = new THREE.AmbientLight( 0xffffff, .15 );
                scene.add(amblight)

                light = new THREE.PointLight( 0xffccaa, 40, 800 );
                scene.add( light );
            
            

                geometry = new THREE.CircleGeometry(100,100);
                material = new THREE.MeshBasicMaterial({color: 0xffccaa});
                sun = new THREE.Mesh(geometry, material);
                sun.position.set(-1450,800,-5000);
                sun.layers.set( 1 );
                scene.add(sun);

                dirLight = new THREE.DirectionalLight(0xffffff, 3)
                scene.add(dirLight)

                let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, sun, {
                    resolutionScale: 1,
                    density: 1,
                    decay: .97,
                    weight: 0.9,
                    samples: 100
                });
                
                let areaImage = new Image();
                    areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;
                let searchImage = new Image();
                    searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;
                let smaaEffect = new POSTPROCESSING.SMAAEffect(searchImage,areaImage,1);


                let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
                let effectPass = new POSTPROCESSING.EffectPass(camera,smaaEffect,godraysEffect);
                effectPass.renderToScreen = true;


                
                composer = new POSTPROCESSING.EffectComposer(renderer);
                composer.addPass(renderPass);
                composer.addPass(effectPass);



			// Create Water
				let waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
                    water = new THREE.Water(
                        waterGeometry,
                        {
                            textureWidth: 512,
                            textureHeight: 592,
                            waterNormals: new THREE.TextureLoader().load( 'assets/images/waternormals.jpg', function ( texture ) {
                                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            } ),
                            alpha: 1.0,
                            sunDirection: light.position.clone().normalize(),
                            sunColor: 'rgb(212, 35, 55)',
                            waterColor: 0x23c27a, //0x001e0f darker
                            distortionScale: 4.2,
                            fog: scene.fog !== undefined
                        }
                    );

                    water.rotation.x = - Math.PI / 2;
                    scene.add( water );

			// Create Skybox
				sky = new THREE.Sky();

				uniforms = sky.material.uniforms;
                    uniforms[ 'turbidity' ].value = 20;
                    uniforms[ 'rayleigh' ].value = 2;
                    uniforms[ 'luminance' ].value = 1.1;
                    uniforms[ 'mieCoefficient' ].value = 0.005;
                    uniforms[ 'mieDirectionalG' ].value = .8;

                    parameters = {
                        distance: 50,
                        inclination: .45 ,
                        azimuth: 0.205
                    };

				cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
				cubeCamera.renderTarget.texture.generateMipmaps = true;
				cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;

				scene.background = cubeCamera.renderTarget;

            // Update sun
                updateSun();
            
            // Create Objects
                loadModels()

                addClouds()

                addSpace()
                addStars(300, 1, "#ffffff")
                addFlickerStars(50, .7, '#fffea8')

			// Create controls
				controls = new THREE.FirstPersonControls( camera, renderer.domElement );
                // controls.movementSpeed = 15;
                // controls.lookSpeed = 0.05;
                // controls.enabled = true

                //this.mouseDragOn is on true in module;
				

			// Create stats
                addStats()

            // Create GUI
                // addGui()

            // Update on scroll
                updateOnScroll()	

                let documentLength = document.querySelector('#container') 
                // console.log(documentLength )
                let start = documentLength/3
                // window.scroll(0, start);
                // documentLength.scrollIntoView()
                
        
                let controller = new ScrollMagic.Controller();
                let scrollScene = new ScrollMagic.Scene({triggerElement: "#container", duration: start})
                                        .setPin("#container")
                                        .addTo(controller);

    }
            

	function animate() {
        requestAnimationFrame( animate )
        stats.update();
        controls.update( clock.getDelta() );
        render();
	}

	function render() {
        // console.log(moon.position.y)
        // if (moon.position.y > 60){
        //     // show stars
        //     camera.layers.enable( 2 );
        //     time = performance.now() * 0.008;
        //     flickerStars.material.opacity = Math.sin( time )
        //     stars.rotation.x += .0002
        // } else {
        //     camera.layers.disable( 2 );
        // }


        // nightSky.rotation.x += .0001
		water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        // renderer.render( scene, camera );
        composer.render(0.1);
    }



    


    // Play scene
    init();
    setTimeout(() => {
        animate();
    }, 1000);


