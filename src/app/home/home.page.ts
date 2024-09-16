import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private view!: MapView; // Menggunakan non-null assertion

  constructor() {}

  public async ngOnInit() {
    // Inisialisasi peta
    const map = new Map({
      basemap: "topo-vector"
    });

    // Mendapatkan lokasi pengguna menggunakan Geolocation
    const coordinates = await this.getCurrentPosition();

    // Buat instance MapView dengan peta dan lokasi pengguna
    this.view = new MapView({
      container: "container",
      map: map,
      zoom: 14, // Ubah zoom sesuai kebutuhan
      center: [coordinates.longitude, coordinates.latitude] // Gunakan lokasi pengguna
    });

    // Tambahkan marker ke lokasi pengguna
    this.addMarker(coordinates.latitude, coordinates.longitude);
  }

  // Fungsi untuk mendapatkan lokasi pengguna
  private async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location', error);
      // Kembalikan nilai default jika terjadi kesalahan
      return {
        latitude: 46.2773790378953, // Koordinat default
        longitude: 74.4313477254261 // Koordinat default
      };
    }
  }

  // Fungsi untuk menambahkan marker ke peta
  private addMarker(latitude: number, longitude: number) {
    const point = new Point({
      longitude: longitude,
      latitude: latitude
    });

    const markerSymbol = new SimpleMarkerSymbol({
      color: [255, 0, 0],  // Warna marker
      outline: {
        color: [255, 255, 255],  // Warna outline marker
        width: 2
      }
    });

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    // Tambahkan graphic marker ke peta
    this.view.graphics.add(pointGraphic);
  }
}
