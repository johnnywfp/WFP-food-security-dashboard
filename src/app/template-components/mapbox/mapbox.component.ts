import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../../environments/environment';
import {geoJSON} from "../../extras/geoJSON";
import {UtilsService} from "../../services/utils/utils.service";

@Component({
    selector: 'app-mapbox',
    templateUrl: './mapbox.component.html',
    styleUrls: ['./mapbox.component.scss']
})
export class MapboxMapComponent implements OnInit {
    map: mapboxgl.Map;
    @Output() countyClicked: EventEmitter<string> = new EventEmitter();
    fillOpacity: number = 0.2; // Opacità del riempimento
    colorYemen = '#919191';
    colorSyria = '#919191';
    popup: mapboxgl.Popup;
    @Output() mapReady = new EventEmitter<unknown>();
    @Input() country!: string;
    positiveCFII;
    initialCenter: any = [41.755781, 25.459727];
    initialZoom = 3;
    syriaCoordinates: any = [38.49367075074648, 35.01266935908628];
    yemenCoordinates: any = [47.60629365446656, 15.844045574792625];

    constructor(
        private utilsService: UtilsService

    ) {
        (mapboxgl as any).accessToken = environment.mapboxAccessToken; // Sostituisci con la tua chiave
        this.popup = new mapboxgl.Popup({closeButton: false}); // Popup senza pulsante di chiusura
    }

    ngOnInit(): void {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.initialCenter,
            zoom: this.initialZoom
        });

        this.map.on('load', () => {
            this.mapReady.emit(this);
            // Aggiungi la fonte per i confini dei paesi
            this.map.addSource('country-boundaries', {
                'type': 'vector',
                'url': 'mapbox://mapbox.country-boundaries-v1' // Usa la fonte di Mapbox
            });

            // Aggiungi il layer per i confini dei paesi
            this.addCountryFillLayer('YE', this.colorYemen); // Yemen con colore rosso
            this.addCountryFillLayer('SY', this.colorSyria); // Siria con colore blu

            // Aggiungi eventi di clic e hover
            this.addHoverEvents();
        });
    }

    private addCountryFillLayer(iso: string, color: string) {
        // Aggiungi il layer di riempimento
        this.map.addLayer({
            'id': `country-fill-${iso}`,
            'type': 'fill',
            'source': 'country-boundaries',
            'source-layer': 'country_boundaries',
            'filter': ['==', 'iso_3166_1', iso],
            'layout': {},
            'paint': {
                'fill-color': color,
                'fill-opacity': this.fillOpacity
            }
        });

// Aggiungi il layer di linea per il bordo
        this.map.addLayer({
            'id': `country-border-${iso}`,
            'type': 'line',
            'source': 'country-boundaries',
            'source-layer': 'country_boundaries',
            'filter': ['==', 'iso_3166_1', iso],
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'black', // Colore del bordo
                'line-width': 1 // Spessore del bordo
            }
        });
    }

    private addHoverEvents() {
        // Cambia il cursore quando si passa sopra Yemen
        this.map.on('mouseenter', 'country-fill-YE', () => {
            this.map.getCanvas().style.cursor = 'pointer'; // Cambia il cursore a manina
        });

        // Ripristina il cursore quando esce dal layer Yemen
        this.map.on('mouseleave', 'country-fill-YE', () => {
            this.map.getCanvas().style.cursor = ''; // Ripristina il cursore
        });

        // Evento di clic sul layer Yemen
        this.map.on('click', 'country-fill-YE', (e) => {
            if (this.country === 'YEM') {
                return;
            }
            this.countyClicked.emit('YEM');
            this.flyTo(this.yemenCoordinates[0], this.yemenCoordinates[1]);
            this.changeBGColor('YEM');
        });

        // Cambia il cursore quando si passa sopra Siria
        this.map.on('mouseenter', 'country-fill-SY', () => {
            this.map.getCanvas().style.cursor = 'pointer'; // Cambia il cursore a manina
        });

        // Ripristina il cursore quando esce dal layer Siria
        this.map.on('mouseleave', 'country-fill-SY', () => {
            this.map.getCanvas().style.cursor = ''; // Ripristina il cursore
        });

        // Evento di clic sul layer Siria
        this.map.on('click', 'country-fill-SY', (e) => {
            if (this.country === 'SYR') {
                return;
            }
            this.countyClicked.emit('SYR');
            this.flyTo(this.syriaCoordinates[0], this.syriaCoordinates[1]);
            this.changeBGColor('SYR');
        });
    }

    flyToCountry(country) {
        if (country === 'SYR') {
            this.flyTo(this.syriaCoordinates[0], this.syriaCoordinates[1]);
        } else if (country === 'YEM') {
            this.flyTo(this.yemenCoordinates[0], this.yemenCoordinates[1]);
        }
    }

    flyTo(lng, lat) {
        this.map.flyTo({
            center: [lng, lat],
            padding: {top: 10, bottom: 10, left: 10, right: 10},
            duration: 1000,
            zoom: 5,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }

    changeBGColor(state) {
        if (state === 'SYR') {
            // this.map.setPaintProperty('country-fill-SY', 'fill-color', 'rgba(255, 255, 255, 0.1)');
            this.map.setPaintProperty('country-fill-YE', 'fill-color', this.colorYemen);
        } else if (state === 'YEM') {
            // this.map.setPaintProperty('country-fill-YE', 'fill-color', 'rgba(255, 255, 255, 0.1)');
            this.map.setPaintProperty('country-fill-SY', 'fill-color', this.colorSyria);
        }
    }

    async setPositiveCFII(currentCountry, positiveCFII, allData) {
        this.positiveCFII = positiveCFII;
        switch (currentCountry) {
            case 'SYR':
                this.map.setPaintProperty('country-fill-SY', 'fill-color', this.colorSyria);
                break;
            case 'YEM':
                this.map.setPaintProperty('country-fill-YE', 'fill-color', this.colorYemen);
                break;
        }
        this.cleanMapLayers();
        for (const data of geoJSON) {
            const mDataaa = allData.find(item => item.region.id === data.region);
            if (!mDataaa) {
                continue;
            }
            const isPositiveData = mDataaa?.cfii > 1;

            const mData: any = data.geoJSON;
            // Iterate over each feature in the geoJSON

            for (const feature of mData.features) {

                // Create a unique source for each feature
                this.map.addSource('feature-boundary-' + feature.id, {
                    'type': 'geojson',
                    'data': feature
                });

                // Add the layer for the feature
                this.map.addLayer({
                    'id': 'feature-boundary-layer-' + feature.id,
                    'type': 'fill',
                    'source': 'feature-boundary-' + feature.id,
                    'layout': {},
                    'paint': {
                        'fill-color': isPositiveData ? '#ff4018' : '#00ff00', // Fill color
                        'fill-opacity': this.fillOpacity
                    }
                });

                // Add the outline for the feature
                this.map.addLayer({
                    'id': 'feature-outline-layer-' + feature.id,
                    'type': 'line',
                    'source': 'feature-boundary-' + feature.id,
                    'layout': {},
                    'paint': {
                        'line-color': '#373737', // Outline color
                        'line-width': 1 // Line width
                    }
                });

                // Hover event for the feature layer
                this.map.on('mouseenter', 'feature-boundary-layer-' + feature.id, (e) => {
                    const coordinates = e.lngLat;
                    const regionData = allData.find(a => a.region.id == data.region);
                    this.popup
                        .setLngLat(coordinates) // Position of the popup
                        .setHTML(`<p>Region: ${regionData.region.name}</p><p>Sub: ${feature.properties.Name}</p><p>Population: ${regionData.region.population}</p><br><h4>CFII: ${regionData.cfii.toFixed(2)}</h4>`) // Popup content
                        .addClassName('my-popup')
                        .addTo(this.map);
                    this.utilsService.hoveredRegion = regionData.region;
                });

                this.map.on('mouseleave', 'feature-boundary-layer-' + feature.id, () => {
                    this.utilsService.hoveredRegion = null;
                    this.popup.remove();
                });
            }

            await this.sleep(10)
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    cleanMapLayers() {
        const layerIds = this.map.getStyle().layers.map(layer => layer.id);
        layerIds.forEach(layerId => {
            if (layerId.startsWith('feature-boundary-layer-')) {
                this.map.removeLayer(layerId);
            }
        });
        layerIds.forEach(layerId => {
            if (layerId.startsWith('feature-outline-layer-')) {
                this.map.removeLayer(layerId);
            }
        });

        const sourceIds = Object.keys(this.map.getStyle().sources);
        sourceIds.forEach(sourceId => {
            if (sourceId.startsWith('feature-boundary-')) {
                this.map.removeSource(sourceId);
            }
        });
    }

    // resetInitialPosition() {
    //     this.map.flyTo({
    //         center: this.initialCenter,
    //         zoom: this.initialZoom
    //     });
    //     this.positiveCFII = null;
    //     this.country = null;
    // }
}
