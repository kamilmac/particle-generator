import {Component} from 'angular2/core';
import {ThreeService} from '../services/three.service'

@Component({
    template: `
        <div id="three_scene_container"></div>
        
    `,
    selector: 'app'
})
export class AppComponent {
    private bornFreq = 0;
    private particles;
    private socket;
    private socketActive;

    constructor(public three:ThreeService) {}

    ngOnInit() {
        this.particles = [];
        this.socketActive = false;
        
        this.initMIDI();
        
        this.socket = new WebSocket("ws://localhost:5060/getparticles", "protocolOne");

        this.socket.onopen = (event) => {
            this.socketActive = true;
        };

        this.socket.onmessage = (event) => {
            let new_particles = JSON.parse(event.data);
            let temp = [];
            for(let p of new_particles) {
                temp.push({
                    x: p.X,
                    y: p.Y,
                    z: p.Z
                });
            }
            this.particles = temp;
        }
        this.three.attach('three_scene_container');
        this.animate();
        // this.three.animate();
        
        // anim() {
        //     requestanimationframe(frame())
        //     midi = getMidiState
        //     particles = getNewParticles(midi)
        //     render(particles)
        // }
    }
    
    
    initMIDI() {
        navigator.requestMIDIAccess().then(midiAccess => {
            // Get first available midi input device
            const firstInput = midiAccess.inputs.values().next().value;

            // Set a handler that outputs the incoming message
            firstInput.onmidimessage = (event) => {
                this.bornFreq = this.parseMIDIEvent(event).data[1];
            };
        });
    }
    
    parseMIDIEvent(event) {
        return {
            status: event.data[0] & 0xf0,
            data: [
                event.data[1],
                event.data[2]
            ]
        };
    }
    
    animate() {
        //console.log(this.socketActive)
        requestAnimationFrame(this.animate.bind(this));
        if(this.socketActive) {
            var midiData = JSON.stringify(
                {
                    BornFreq: this.bornFreq
                }
            );
            console.log("sending: ", midiData);
            this.socket.send(midiData);
        }
        // if(this.particles && this.particles.length) {
            this.three.renderFrame(this.particles);
            this.particles = [];
        // }
    }
}
