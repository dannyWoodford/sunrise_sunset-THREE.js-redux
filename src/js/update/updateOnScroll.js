

function updateOnScroll(){
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener("wheel", function(event) {
        {
        

            console.log(moon.position.y)

            if (event.deltaY > 0 )
                {
                    if(parameters.inclination >= .32){
                        parameters.inclination -= .01
                        
                        updateSun()
                    }
                    dayTimeLine = true

                        if( navTopInner.classList.contains('current')){
                            navTopInner.classList.remove('current')
                            navBottomInner.classList.add('current')
                        } 
                        if (!navTopInner.classList.contains('current') && window.scrollY > 818 && window.scrollY < 1070 ){
                            navTopOuter.classList.remove('current')
                            navTopInner.classList.remove('current')
                            navBottomInner.classList.add('current')
                            navBottomOuter.classList.remove('current')
                        } 
                        if (!navTopInner.classList.contains('current') && window.scrollY < 818 ) {
                            navTopOuter.classList.remove('current')
                            navTopInner.classList.add('current')
                            navBottomInner.classList.remove('current')
                            navBottomOuter.classList.remove('current')
                        }
                        if (!navTopInner.classList.contains('current') && window.scrollY > 1070) {
                            navTopOuter.classList.remove('current')
                            navTopInner.classList.remove('current')
                            navBottomInner.classList.remove('current')
                            navBottomOuter.classList.add('current')
                        }

                            initialScrollDowntoDayTimeline()

                            setTimeout(() => {
                                enableScroll()
                            }, 1700);
                }
                else if (event.deltaY < 0)
                {

                    if(parameters.inclination <= .51){
                        parameters.inclination += .03
                        updateSun()
                    }

                    // console.log(window.scrollY <= container.offsetTop, "night")
                    nightTimeLine = true
                    
                    if( navBottomInner.classList.contains('current')){
                        navBottomInner.classList.remove('current')
                        navTopInner.classList.add('current')
                    } 
                    if (!navBottomInner.classList.contains('current') && window.scrollY < 821 && window.scrollY > 636 ){
                        navTopOuter.classList.remove('current')
                        navTopInner.classList.add('current')
                        navBottomInner.classList.remove('current')
                        navBottomOuter.classList.remove('current')
                    } 
                    if (!navBottomInner.classList.contains('current') && window.scrollY > 821) {
                        navTopOuter.classList.remove('current')
                        navTopInner.classList.remove('current')
                        navBottomInner.classList.add('current')
                        navBottomOuter.classList.remove('current')
                    }
                    if (!navBottomInner.classList.contains('current') && window.scrollY < 636) {
                        navBottomOuter.classList.remove('current')
                        navBottomInner.classList.remove('current')
                        navTopInner.classList.remove('current')
                        navTopOuter.classList.add('current')
                    }
                            initialScrollUptoNightTimeline()
                            setTimeout(() => {
                                enableScroll()
                            }, 1700);
        
                }
        }
    })
}


function initialScrollUptoNightTimeline(){
    let tl1 = gsap.timeline()
    tl1.to(logo.position, {y: -30, duration: 3, delay: .1,},0);
    camera.layers.disable( 1 )
    tl1.to(sun.position, {y: -75, duration: 1.5},0);
    tl1.to(sun.scale, {x: 1.7, y: 1.7, z:1.7 , duration: 1.5},0);

    tl1.to(moon.position, {y: 150, duration: 3},0);
    tl1.to(moon.scale, {x: 3, y: 3, z:3 , duration: 3.5},0);
    tl1.to(moonMaterial, {opacity: 1, duration: 3},0);
    tl1.to(moon.rotation, {y: '60', duration: 100 , ease:Linear.easeNone, repeat:-1},0);
    
    camera.layers.enable( 3 )
        cloudParticle.forEach( p => {
            let cloudTl = gsap.timeline();
            cloudTl.to(p.position, {z: 160, duration: 10.5,  ease: "bounce.out"},0);
            cloudTl.to(p.position, {x: 1, duration: 10.5},0);
            cloudTl.to(p.rotation, {x: 1, duration: 10.5},0);
            
            cloudTl.fromTo( p.material,{opacity: Math.random()* .3 - .3}, {opacity: .4, duration: 10 },0);
        })

    camera.layers.enable( 2 )
    tl1.to( stars.material, {opacity: 1, duration: 5},0);
    tl1.to( nightSky.material, {opacity: .3, duration: 5},0);
}


function initialScrollDowntoDayTimeline() {
    let tl2 = gsap.timeline()

    camera.layers.enable( 1 )
    tl2.to(logo.position, {y: 80, duration: 2},0);
    
    tl2.to(sun.position, {y: 1800, duration: 3.5},0);
    tl2.to(sun.scale, {x: 3, y: 3, z: 3 , duration: 4.5},0);
    
    tl2.to(moon.position, {y: 40, duration: 2},0);
    tl2.to(moon.scale, {x: 1, y: 1, z:1 , duration: 2},0);

    setTimeout(() => {
        camera.layers.disable( 2 )
        camera.layers.disable( 3 )
    }, 600);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}