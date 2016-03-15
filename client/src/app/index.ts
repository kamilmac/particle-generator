/// <reference path="../../typings/threejs/three.d.ts" />

import { bootstrap }            from 'angular2/platform/browser';
import { AppComponent }         from './components/app.component';
import { ThreeService } 	    from './services/three.service';

bootstrap(AppComponent, [ThreeService]);
