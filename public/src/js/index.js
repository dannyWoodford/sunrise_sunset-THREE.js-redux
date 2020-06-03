let container = document.getElementById( 'container' );
let stats, gui;
let camera, scene, renderer, light, amblight, moonLight, sun, circleGeo, circleMat, composer, stars, flickerStars, nightSky
let controls, cubeCamera, uniforms, sky, water, loader, dracoLoader, logo, moon, moonMaterial, time ,inclination, parameters;
let cloudParticle = []
let clock = new THREE.Clock();
let documentLength = document.querySelector('body').offsetHeight
let start = documentLength/3
let body = document.querySelector('body')

let nightTimeLine = false 
let dayTimeLine = false
let day = window.scrollY-10 > start
let night = window.scrollY+10 < start

// nav
let navTopOuter = document.querySelector('.top-outer')
let navTopInner = document.querySelector('.top-inner')
let navCenter = document.querySelector('.center')
let navBottomInner = document.querySelector('.bottom-inner')
let navBottomOuter = document.querySelector('.bottom-outer')

function init() {


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
				camera.layers.enable( 3 ); // clouds
		
			// Create lights
				amblight = new THREE.AmbientLight( 0xffffff, .25 );
                scene.add(amblight)

                light = new THREE.PointLight( 0xffccaa, 20, 800 );
                scene.add( light );

            //addSun
                addSun()

                let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, sun, {
                    resolutionScale: 1,
                    density: 1,
                    decay: .97,
                    weight: 0.8,
                    samples: 35
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
            

			// Create stats
                // addStats()

            // Create GUI
                addGui()

            // Update on scroll
                updateOnScroll()
    }

    function setWindow(){
        if(nightTimeLine == false && dayTimeLine == false){
            window.scrollTo(0, start);
            navCenter.classList.add('current')
        } else {
            navCenter.classList.remove('current')
        }
    }
            

	function animate() {
        requestAnimationFrame( animate )
        // stats.update();

        if (moon.position.y > 60){
            time = performance.now() * 0.008;
            flickerStars.material.opacity = Math.sin( time )
            gsap.to( stars.rotation, {x: 1, duration: 2750});
        } else {
            moonMaterial.opacity = 0
        }
        render();
	}

	function render() {
		water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        composer.render(0.1);
        start = documentLength/3
        setWindow()
    }



    
    function enableScroll() { 
        body.classList.add("start-scrolling"); 
    } 
    
    function disableScroll() { 
        body.classList.remove("start-scrolling"); 
    } 


    // Play scene
    init();

    let loadingAnimation = document.querySelector(".full-screen-loading-background")

    setTimeout(() => {
        animate();
        loadingAnimation.classList.add('hide-loading-page')
    }, 1300);


