function addSun() {
    geometry = new THREE.CircleGeometry(100,100);
    material = new THREE.MeshBasicMaterial({color: 0xffccaa});
    sun = new THREE.Mesh(geometry, material);
    sun.position.set(-1450,800,-5000);
    // sun.position.x = -1450
    // gsap.to(sun.position, {y: 800, duration: 1});
    // sun.position.z = -5000
    sun.layers.set( 1 );
    scene.add(sun);
}