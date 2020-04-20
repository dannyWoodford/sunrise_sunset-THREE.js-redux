
    function loadModels(){

        loader = new THREE.GLTFLoader()

        dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath( '/examples/js/loaders/DRACOLoader.js' );
        loader.setDRACOLoader( dracoLoader );

        loader.load('assets/3d/logo/scene.gltf',
            function ( gltf ) {
                logo = gltf.scene
                logo.scale.set(.5,.5,.5)
                logo.rotation.y = 3.38
                logo.position.y = -32 
                logo.position.x = 10 

                gsap.to(logo.position, {y: 32, duration: 3,  ease: "back.out(1.7)"});
                scene.add(logo);
            }
        )

        loader.load('assets/3d/moon/scene.gltf',
            function ( gltf ) {
                moon = gltf.scene
                moon.traverse( function ( child ) {
                    
                    if ( child.isMesh ) { 
                        
                        child.material.transparent = true;
                        child.material.opacity = 0
                        moonMaterial = child.material
                        // child.customDepthMaterial = new THREE.MeshStandardMaterial({ alphaTest: .2 });
                        // child.material.color =  new THREE.Color("rgb(255, 0, 0)");
                        
                
                    }
                
                }  );
                moon.scale.set(2,2,2)
            
                moon.position.x = 105 
                moon.position.y = 40 
                moon.position.z = -60

                moon.layers.set( 1 );
                scene.add(moon);
            }
        )
    }