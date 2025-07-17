
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxMap, { NavigationControl, FullscreenControl, useControl} from 'react-map-gl/mapbox';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useRef } from 'react';
import type { Feature, Polygon } from 'geojson';
import { Source, Layer } from 'react-map-gl/mapbox';
import type { ZoneType } from './sites';
import DrawDefaultStyles from '../MapBoxDrawDefaultTheme'
import useMap from '../hooks/useMap';
import { bbox } from '@turf/turf';

type MapProps = {
  isEditing: boolean,
};


type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  onCreate: (e: { features: [] }) => void,
  onUpdate: (e: { features: [], action: string }) => void,
  onDelete: (e: { features: [] }) => void,
  onInit?: (draw: MapboxDraw) => void
};


const DrawControl = (props: DrawControlProps) => {
  const drawInstanceRef = useRef<MapboxDraw | null>(null);
  useControl<MapboxDraw>(() => {
   if (!drawInstanceRef.current) {
      drawInstanceRef.current = new MapboxDraw(props);
      props.onInit?.(drawInstanceRef.current);
    }
    return drawInstanceRef.current;
  },
    ({ map }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
    });

  return null;
}



const Map: React.FC<MapProps> = ({ isEditing }) => {

  //const drawRef = useRef<MapboxDraw | null>(null);
  const { drawRef, zones, setZones, mapRef } = useMap();;


  const onCreate = (e: { features: [] }) => {
    console.log(e.features);
    
    setZones(prev => {
      const newZones: ZoneType[] = e.features.map((f: Feature<Polygon>, i: number) => {
        f.properties = {
          color: 'steelblue'
        };

        return {
          feature: f,
          name: `Zone-${prev.length + i + 1}`,
        };
      });

      return [...prev, ...newZones];
    });

  }

  const onUpdate = (e: { features: Feature<Polygon>[] }) => {
    setZones(prev => prev.map((zone: ZoneType) => {

      if (zone.feature.id === e.features[0].id) {
        const updatedZone: ZoneType = {
          ...zone,
          feature: e.features[0],
        }

        updatedZone.feature.properties = {
          color: zone.feature.properties?.color
        };

        return updatedZone;
      }
      else
        return zone;
    }));
  }

  const onDelete = (e: { features: Feature<Polygon>[] }) => {    
    setZones(prev => prev.filter((zone) => zone.feature.id !== e.features[0].id));
  }


  return (
    <div className="w-1/3 bg-white rounded-xl relative" id="map" style={{ height: '100%' }}>
      <MapboxMap
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        ref={mapRef}
        initialViewState={{
          longitude: 35.9,
          latitude: 31.9,
          zoom: 8,
        }}
        mapStyle={'mapbox://styles/mapbox/satellite-v9'}
        style={{
          borderRadius: "10px",
        }}
        onLoad={() => {
          const [minLng, minLat, maxLng, maxLat] = bbox(EXAMPLE);

            mapRef.current?.fitBounds(
              [
                [minLng, minLat],
                [maxLng, maxLat]
              ],
              {padding: 30, duration: 3000}
            );
            console.log('map is ready')
        }}
      >
        <NavigationControl />
        <FullscreenControl />
        <Source type='geojson' data={EXAMPLE}>
          <Layer
              id='outline'
              type="line"
              paint={{ 'line-color': 'red', 'line-width': 2 }}
          />
        </Source>
        
        {isEditing && <DrawControl 
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          userProperties={true}
          styles={
            DrawDefaultStyles
          }
          onInit={(draw) => {
            drawRef.current = draw;
            
            requestAnimationFrame(() => {
              if (isEditing) {
                try {
                  //draw.deleteAll();
                  zones.forEach((z) => draw.add(z.feature));
                  console.log(zones[0].feature)
                }
                catch (err) {
                  console.log(err);
                }
              }
            });
          }}
        />}
        {!isEditing && zones.length > 0 && (
          <Source type='geojson' data={{ type: 'FeatureCollection', features: zones.map(z => z.feature) }}>
            <Layer
              id={`zone-fill`}
              type="fill"
              paint={{ 'fill-color': ['get', 'color'], 'fill-opacity': 0.3 }}
            />
            <Layer
              id={`zone-outline`}
              type="line"
              paint={{ 'line-color': ['get', 'color'], 'line-width': 2 }}
            />
          </Source>
        )}
        
      </MapboxMap>
      {isEditing &&
        <p className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 p-2 text-white text-xs font-bold rounded-md backdrop-blur-md'>
          Draw & Add a New Zone
        </p>}
    </div>
  );
}


const EXAMPLE : Feature<Polygon>= {
  "id": "WHvpm5nJ6K68FZh01jmqEDjWvTKTuC5O",
  "type": "Feature",
  "properties": {
    "color": "steelblue"
  },
  "geometry": {
    "coordinates": [
      [
        [
          35.83135292821629,
          31.96957542996384
        ],
        [
          35.83023059578787,
          31.972041262379165
        ],
        [
          35.834980369017075,
          31.97360307463879
        ],
        [
          35.836211908565105,
          31.97135576489883
        ],
        [
          35.83135292821629,
          31.96957542996384
        ]
      ]
    ],
    "type": "Polygon"
  }
}


export default Map;