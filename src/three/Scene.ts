import * as THREE from 'three';

class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any
    blocks: any

    constructor() {

        this.init()
    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        const clock = new THREE.Clock();
    
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.set( 0, 3, 7 );
        this.scene.add(this.camera);
    
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true
    
        document.querySelector("#screen").appendChild( this.renderer.domElement );
        
        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;

        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);


        
        this.animate();
        this.addSphere()
    }

    addSphere() {
        const geometry = new THREE.SphereGeometry( 10, 32, 16 ); 
        const loader  = new THREE.TextureLoader()
        // const texture = loader.load( "https://cdn.pixabay.com/photo/2023/10/23/17/25/hike-8336525_1280.jpg" );

        const video: any = document.getElementById( 'video' );
        const texture = new THREE.VideoTexture( video );

        const material = new THREE.MeshBasicMaterial( { map: texture } ); 
        const sphere = new THREE.Mesh( geometry, material ); 
        sphere.material.side = THREE.BackSide;
        this.scene.add( sphere );
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.renderer.render( this.scene, this.camera );
    }

    
}




export { Scene }