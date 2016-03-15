/// <reference path="../../../typings/threejs/three.d.ts" />

import {Injectable} from 'angular2/core';

interface Point {
    x: number;
    y: number;
    z: number;
}

@Injectable()
export class ThreeService {
    private positions: Float32Array;
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private colors: Float32Array;
    private color: THREE.Color;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.BufferGeometry;
    private particleSystem: THREE.Points;
    private container: HTMLElement;
    private SIZE: number;
    private HOWMANY: number;
    private index: number;
    private current_position: Point;
    private momentum: Point;
    private socketActive = false;

    constructor() {
        this.geometry = new THREE.BufferGeometry();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 50, 3500 );
        this.camera.position.z = 2750;
        this.HOWMANY = 1000;
        this.SIZE = 20;
        this.positions = new Float32Array( this.HOWMANY * 3 );
        this.color = new THREE.Color();
        this.colors = new Float32Array( this.HOWMANY * 3 );
        this.index = 0;
        this.current_position = {
            x:0,
            y:-500,
            z:0
        };

        
    }

    attach(container_id: string) {
        this.container = document.getElementById(container_id);

        let n = 1000, n2 = n / 2; // particles spread in the cube

        for ( let i = 0; i < this.positions.length; i += 3 ) {
            // positions
            let x = Math.random() * n - n2;
            let y = Math.random() * n - n2;
            let z = Math.random() * n - n2;

            this.positions[ i ]     = 0;
            this.positions[ i + 1 ] = 0;
            this.positions[ i + 2 ] = 0;

            // colors


            let vx = ( x / n ) + 0.5;
            let vy = ( y / n ) + 0.5;
            let vz = ( z / n ) + 0.5;

            this.color.setRGB( vx, vy, vz );

            this.colors[ i ]     = this.color.r;
            this.colors[ i + 1 ] = this.color.g;
            this.colors[ i + 2 ] = this.color.b;
        }


        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
        this.geometry.addAttribute( 'color', new THREE.BufferAttribute( this.colors, 3 ) );

        // this.geometry.computeBoundingSphere();

        let material = new THREE.PointsMaterial( { size: this.SIZE, vertexColors: THREE.VertexColors } );
        this.particleSystem = new THREE.Points( this.geometry, material );
        this.scene.add( this.particleSystem );

        this.renderer = new THREE.WebGLRenderer( { antialias: false } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0x222222, 1 );

        this.container.appendChild( this.renderer.domElement );

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }


    // animate() {
    //     requestAnimationFrame(this.animate.bind(this));
    //     this.render();
    // }

    get_momentum(): Point {
        return {
            x: Math.cos(this.index/3)*100,
            y: Math.sin(this.index/12)*100,
            z: Math.sin(this.index/3)*10
        }
    }

    renderFrame(particles) {
        // let a = 1, PART = 1;
        // for (let i = 3*(this.HOWMANY - this.HOWMANY/PART); i < 3 * this.HOWMANY; i+=1) {
        //     this.geometry.attributes.position.array[i] += (Math.random()*a - a/2);
        // }

        // for (let i = 3*(this.HOWMANY - this.HOWMANY/PART); i < 3 * this.HOWMANY; i+=1) {
        //     this.geometry.attributes.position.array[i] += (Math.random()*a - a/2);
        // }

        // console.log(this.current_position)
        for(let p of particles) {
            this.geometry.attributes.position.array[this.index] = p.x;
            this.geometry.attributes.position.array[this.index+1] = p.y;
            this.geometry.attributes.position.array[this.index+2] = p.z;
            this.index+=3;
        }

        // if(this.socketActive) {
            // console.log("sending to socket")
            // this.socket.send("SOCKET GO");
        // }

        // console.log(geometry.attributes.position.array)
        // let pCount = PART0;
        //     while(pCount--) {

        //     // get the particle
        //     let particle = geometry.vertices[pCount];

        //     // check if we need to reset
        //         particle.position.y += 0.002;

        //     // update the velocity with
        //     // a splat of randomniz

        //     // and the position
        //     // particle.position.addSelf(particle.velocity);

        // }

            // flag to the particle system
            // that we've changed its vertices.
        this.geometry.attributes.position.needsUpdate = true;
        // particleSystem.geometry.__dirtyVertices = true;


        // let positionAttr = this.geometry.attributes.position;
        // if not using DynamicBufferAttribute initialize updateRange:
        // positionAttr.updateRange = {};
        // positionAttr.updateRange.offset = 3*(this.HOWMANY - this.HOWMANY/PART); // where to start updating
        // positionAttr.updateRange.count = 3*(this.HOWMANY/PART); // how many vertices to update
        // positionAttr.needsUpdate = true;

        this.particleSystem.rotation.x += 0.015;
        this.particleSystem.rotation.y +=  0.015;

        this.renderer.render( this.scene, this.camera );
    }

}
