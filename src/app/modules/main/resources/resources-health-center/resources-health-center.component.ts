import { Component, computed, effect, inject, signal } from '@angular/core';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { HealthCenterResponse } from '../../../../core/interfaces/health-center-http.interface';
import { HealthCenterService } from '../../../../core/services/health-center.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, NEVER, tap } from 'rxjs';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control/defaults';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style } from 'ol/style';
import { calculateDistance } from '../../../../shared/utils/map-functions';
import { Router } from '@angular/router';

@Component({
  selector: 'resources-health-center',
  templateUrl: './resources-health-center.component.html',
  imports: []
})
export default class ResourcesHealthCenterComponent {
  centersService = inject(HealthCenterService);
  toastService = inject(ToastService);

  private router = inject(Router)

  olMap!: Map;
  selectedCenter = signal<HealthCenterResponse | null>(null);

  healthCenters = signal<HealthCenterResponse[]>([]);
  searchQuery = signal('');
  userLocation = signal<{ latitude: number; longitude: number } | null>(null);
  dataType = signal<'all' | 'near'>('near');

  centersLength = computed(() => this.filteredCenters().length);
  filteredCenters = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (query.length === 0) {
      setTimeout(() => {
        this.addMarkersToMap(this.healthCenters());
      }, 1000);
      return [...this.healthCenters()];
    }

    const filteredCenters = this.healthCenters().filter((center) => {
      const name = (center.name || '').toLowerCase();
      const address = (center.address || '').toLowerCase();

      return name.includes(query) || address.includes(query);
    });

    setTimeout(() => {
      this.addMarkersToMap(filteredCenters);
    }, 1000);

    return filteredCenters;
  });

  centers = rxResource({
    loader: () => this.centersService.getAllActive().pipe(
      map(response => response.result)
    )
  });

  nearCenters = rxResource({
    request: () => this.userLocation(),
    loader: (request) => this.userLocation() !== null ? this.centersService.getNearbyHealthCenters(this.userLocation()!.latitude, this.userLocation()!.longitude).pipe(
      map(response => response.result.filter(center => center.status === 'ACTIVE')),
      tap(centers => {
        this.addMarkersToMap(centers);
        this.healthCenters.set(centers);
        this.dataType.set('near');
      })
    ) : NEVER
  });

  constructor() {
    effect(async () => {
      try {
        const userCords = await this.getUserLocation();
        this.userLocation.set(userCords);
      } catch (error) {
        console.error('Error al obtener la ubicación del usuario:', error);
        this.toastService.addToast({
          message: 'Error al obtener la ubicación del usuario',
          type: 'error',
          duration: 4000
        });

        this.userLocation.set(null);
      }
    });

    effect(() => {
      if (this.centers.error() && this.nearCenters.error()) {
        this.toastService.addToast({
          type: 'error',
          message: 'Error al cargar centros de salud',
          duration: 4000
        });
      } else if (this.centers.value()!.length > 0 && !this.userLocation()) {
        this.addMarkersToMap(this.centers.value()!);
        this.healthCenters.set(this.centers.value()!);
        this.dataType.set('all');
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 100); // Pequeño retraso para asegurar que el DOM esté listo
  }

  initMap() {
    // Centro inicial en Lima, Perú
    this.olMap = new Map({
      target: 'map',
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([-77.0428, -12.0464]), // [longitud, latitud]
        zoom: 12
      }),
      // Personalizar los controles para que ocupen menos espacio
      controls: defaultControls({
        zoom: true,
        rotate: false,
        attribution: false // Ocultar la atribución para ahorrar espacio
      })
    });

    // Añadir atribución en una posición menos intrusiva
    const attribution = document.createElement('div');
    attribution.className = 'ol-attribution';
    attribution.innerHTML = '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
    attribution.style.position = 'absolute';
    attribution.style.bottom = '0';
    attribution.style.right = '0';
    attribution.style.fontSize = '10px';
    attribution.style.background = 'rgba(255,255,255,0.7)';
    attribution.style.padding = '2px 5px';
    attribution.style.borderRadius = '3px 0 0 0';
    document.getElementById('map')?.appendChild(attribution);
  }

  addMarkersToMap(centers: HealthCenterResponse[]) {

    const features = centers.map((center) => {
      // Intentar obtener las coordenadas desde varios campos posibles
      const lat = center.latitude;
      const lon = center.longitude;

      // Crear la feature con los datos completos
      // CORREGIDO: Invertimos lat y lon según tu comentario, ahora [lon, lat]
      const feature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
        properties: {
          ['name']: center.name || 'Sin nombre',
          ['address']: center.address || '--------',
          ['phone']: center.phone || 'No especificado',
          ['allData']: center // Guardamos todos los datos para referencia
        }
      });

      return feature;
    }).filter(feature => feature !== null) as Feature[];

    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.8
        })
      })
    });

    // Limpiar capas anteriores y añadir las nuevas
    this.olMap.getLayers().clear();
    this.olMap.addLayer(new TileLayer({ source: new OSM() }));
    this.olMap.addLayer(vectorLayer);

    // Añadir cursor pointer al pasar sobre los marcadores
    this.olMap.on('pointermove', (e) => {
      const pixel = this.olMap.getEventPixel(e.originalEvent);
      const hit = this.olMap.hasFeatureAtPixel(pixel);
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.style.cursor = hit ? 'pointer' : '';
      }
    });

    // Añadir evento de que al hacer click en un marcador lo seleccione y me acerque
    this.olMap.on('click', (evt) => {
      const feature = this.olMap.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      if (feature) {
        const geometry = feature.getGeometry() as Point;
        if (!geometry) return;

        const coordinates = geometry.getCoordinates();
        const properties = feature.get('properties') || {};

        // Verificar si tenemos las propiedades necesarias
        if (properties['name']) {
          this.seeOnMap(properties['allData'] as HealthCenterResponse)
        }
      }
    });

    // Ajustar la vista para mostrar todos los marcadores
    if (features.length > 0) {
      const extent = vectorSource.getExtent();
      this.olMap.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 15
      });
    }
  }

  seeOnMap(center: HealthCenterResponse) {
    this.selectedCenter.set(center)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.olMap.getView().animate({
      center: fromLonLat([center.longitude, center.latitude]),
      zoom: 16,
    })
  }

  clearCenterSelected() {
    this.selectedCenter.set(null)

    this.olMap.getView().animate({
      zoom: 13
    })
  }

  getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
          (error) => reject(error)
        );
      }
    });
  }

  calculateDistance(lat: number, lon: number) {
    if (!this.userLocation()) {
      return 0
    }

    return calculateDistance(this.userLocation()!.latitude, this.userLocation()!.longitude, lat, lon).toFixed(2)
  };

  setAllCenters() {
    this.userLocation.set(null)
  }
}
