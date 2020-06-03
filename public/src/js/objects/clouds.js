function addClouds(){
    let  cloudLoader = new THREE.TextureLoader();
    cloudLoader.load('./assets/images/cloud_texture_2.png', function(texture){
        texture.minFilter = THREE.LinearFilter;

        cloudGeo = new THREE.PlaneBufferGeometry(500,80);
        cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        })
        cloudMaterial.depthWrite = false;
        

        for (let p = 0; p < 10; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial)
                // cloud.position.set(
                //     Math.random()* 800 -350,
                //     Math.random()* 10 +15,
                //     Math.random()* -300 +100,
                // )
                cloud.position.y = Math.random()* 10 + 6
                cloud.rotation.x = 3.1
                cloud.rotation.y = -3.2

                cloudParticle.forEach( p => {
                    let cloudTl = gsap.timeline({ repeat:-1});

                        cloudTl.fromTo( p.position,{z: Math.random()* -300 +100}, {z: 160, duration:8.5,  ease: "bounce.out"},0);
                        cloudTl.fromTo( p.position,{x: Math.random()* 800 -350}, {x: 1, duration:8.5},0);
                        cloudTl.to(p.rotation, {x: 1, duration:8.5},0);
                        cloudTl.fromTo( p.material,{opacity: Math.random()* .3 - .3}, {opacity: .4, duration:8 },0);
                })

                cloudParticle.push(cloud)

                
                cloud.layers.set( 3);
                scene.add(cloud) 
        }
    })
}
