import {Injectable} from 'angular2/core';

@Injectable()
export class MidiService {
    private root_path;

    constructor() {
        this.root_path = {
            x:0,y:0,z:0
        };
    }
    
    public updatePath(momentum) {
        this.root_path.x += momentum.x;
        this.root_path.y += momentum.y;
        this.root_path.z += momentum.z;
        
        return this.root_path
    }
}