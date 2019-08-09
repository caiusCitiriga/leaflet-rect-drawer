import { Component } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private map: L.Map;
    private drawControl: L.Control.Draw;
    private drawnLayer: L.DrawEvents.Created;

    public options = {
        layers: [
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, })
        ],
        zoom: 5,
        center: L.latLng(46, 12)
    };

    public drawOptions = {
        position: 'topright',
        draw: {
            marker: {
                icon: L.icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/marker-icon.png',
                    shadowUrl: 'assets/marker-shadow.png'
                })
            },
            square: true,
            circle: true,
            polyline: true,
        }
    };

    public constructor(private readonly httpSvc: HttpClient) { }

    public onDrawEnd(draw: L.DrawEvents.Created): void {
        this.drawnLayer = draw;
        const headers = new HttpHeaders();
        headers.append('content-type', 'application/json');
        this.httpSvc.post(`http://localhost:3000/cover-area`, draw.layer.toGeoJSON(), { headers })
            .subscribe(
                res => {
                    console.log('GeoJSON sent to local server');
                    console.log(res);
                },
                err => {
                    console.log(`[X] Error: ${err.message}`);
                }
            );
    }

    public onDrawReady(dc: L.Control.Draw): void {
        this.drawControl = dc;
    }

    public onMapReady(map: L.Map): void {
        this.map = map;
        console.log(`[+] Map ready`);
    }
}
