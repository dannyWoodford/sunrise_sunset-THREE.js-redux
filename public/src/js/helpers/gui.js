function addGui(){

    gui = new dat.GUI();

        uniforms = water.material.uniforms;
            let folder = gui.addFolder( 'Water' );
            folder.add( uniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
            folder.add( uniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
            folder.open();
}