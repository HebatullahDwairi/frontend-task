import { useEffect, useRef } from 'react';
//import MapBox from 'react-map-gl/mapbox';
//import { FullscreenControl, NavigationControl} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);



  useEffect(()=>{
    mapboxgl.accessToken = "pk.eyJ1IjoiaGViYXR1bGxhaC0xIiwiYSI6ImNtZDFmdW85ZDE2dXgya3NqcTd6cDZmMTcifQ.g5iwMvVR8P2_biHLhWtmxA";

    if(mapContainer.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [35.9, 31.9],
        zoom: 11,
        pitch: 0
      });
    }


    const draw  = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });
    if(mapRef.current) {
      mapRef.current.addControl(new mapboxgl.NavigationControl);
      mapRef.current.addControl(new mapboxgl.FullscreenControl);
      mapRef.current.addControl(draw);
    }
  }, []);
  
  return (
    <div className="flex-1/3   bg-white rounded-xl" id="map" style={{ height: '100%' }} ref={mapContainer}>
      
    </div>
  );
}

export default Map;


/*

<MapBox
        mapboxAccessToken="pk.eyJ1IjoiaGViYXR1bGxhaC0xIiwiYSI6ImNtZDFmdW85ZDE2dXgya3NqcTd6cDZmMTcifQ.g5iwMvVR8P2_biHLhWtmxA"
        initialViewState={{
          longitude: 35.9,
          latitude: 31.9,
          zoom: 11,
          pitch: 0
        }}
        style={{borderRadius: "10px", border: "none"}}
        mapStyle="mapbox://styles/mapbox/standard-satellite"
      >
        <FullscreenControl />
        <NavigationControl />
      </MapBox>

*/