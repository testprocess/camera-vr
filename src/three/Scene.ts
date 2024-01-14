import * as THREE from 'three';
import { VRButton } from './VRButton';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


class Scene {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    peerConnection: RTCPeerConnection;
    root: THREE.Object3D<THREE.Event>;
    sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    screen: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

    constructor({ socket }: { socket: any }) {
        this.socket = socket
        this.init()
    }

    private async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        // this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        const clock = new THREE.Clock();
    
        this.root = new THREE.Object3D();
        this.scene.add( this.root );
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100000 );
        this.camera.position.set( 0, 1, 0 );
        this.root.add(this.camera);
    
    
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

        document.body.appendChild( VRButton.createButton( this.renderer ) );

        this.renderer.xr.enabled = true;
        this.renderer.xr.setReferenceSpaceType( 'local' );


        this.renderer.xr.cameraAutoUpdate = true
        this.renderer.setAnimationLoop( () => {
            const controller = this.renderer.xr.getController(0); 

            this.screen.rotation.x = controller.rotation.x
            this.screen.rotation.y = controller.rotation.y
            this.screen.rotation.z = controller.rotation.z

            this.renderer.render( this.scene, this.camera );
        });

        
        // this.addSphere()
        this.addScreen()
        document.querySelector("#VRButton").addEventListener("click", this.handleClickVRButton.bind(this))
    }

    private handleClickVRButton() {
        const button: HTMLBaseElement = document.querySelector("#VRButton")
        button.style.animationName = 'expendWidth'
        button.style.animationDuration = '1s'
        button.style.animationFillMode = 'forwards'

        setTimeout(() => {
            this.setPeer()
            button.style.animationName = 'fadeOut'
            button.style.animationDuration = '1s'
            button.style.animationFillMode = 'forwards'
        }, 1000);
    }

    private setPeer() {

        this.socket.on("messageoffer", async (message) => {
            const remoteVideo: any = document.querySelector("#video")
            const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
            this.peerConnection = new RTCPeerConnection(configuration);

            this.peerConnection.onicecandidate = e => {
                this.socket.emit("newIceCandidate", e.candidate)
            };

            this.peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
            this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.socket.emit("answer", answer)

        })

        this.socket.on("iceCandidate", async (message) => {
            try {
                await this.peerConnection.addIceCandidate(message);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        })
    }

    private addSphere() {
        const geometry = new THREE.SphereGeometry( 10, 32, 16 ); 
        const video: any = document.getElementById( 'video' );        
        const texture = new THREE.VideoTexture( video );

        texture.center = new THREE.Vector2(0.5, 0.5);
        texture.rotation = Math.PI;
        texture.flipY = false;
        const material = new THREE.MeshBasicMaterial( { map: texture } ); 

        this.sphere = new THREE.Mesh( geometry, material ); 
        this.sphere.material.side = THREE.BackSide;
        this.sphere.rotation.y = Math.PI/2
        this.scene.add( this.sphere );


    }

    private addScreen() {
        const geometry = new THREE.BoxGeometry( 2000, 2000, 2000 ); 
        const video: any = document.getElementById( 'video' );        
        const texture = new THREE.VideoTexture( video );

        texture.center = new THREE.Vector2(0.5, 0.5);
        texture.rotation = Math.PI;
        texture.flipY = false;
        const material = new THREE.MeshBasicMaterial( { map: texture } ); 

        this.screen = new THREE.Mesh( geometry, material ); 
        this.screen.material.side = THREE.BackSide;
        this.scene.add( this.screen );


    }

    private animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.renderer.render( this.scene, this.camera );
    }

    
}




export { Scene }