
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxMap, { NavigationControl, FullscreenControl, useControl} from 'react-map-gl/mapbox';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useRef } from 'react';
import type { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { Source, Layer } from 'react-map-gl/mapbox';
import type { ZoneType } from './sites';
import DrawDefaultStyles from '../MapBoxDrawDefaultTheme'
import useMap from '../hooks/useMap';
import { bbox } from '@turf/turf';
import { Upload } from 'lucide-react';
import { kml } from '@tmcw/togeojson';

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
     // map.on('draw.selectionchange', props.onSelection);
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
     // map.off('draw.selectionchange', props.onSelection);
    });

  return null;
}



const Map: React.FC<MapProps> = ({ isEditing }) => {
  const { drawRef, zones, setZones, mapRef } = useMap();;

  const onCreate = (e: { features: [] }) => {
    
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

  const handleKmlUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if(!file ) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      const val = e.target?.result;
      const parser = new DOMParser();
      const kmlFile = parser.parseFromString(typeof val === 'string' ? val : '', 'text/xml');


      const geojson = kml(kmlFile);


      const newZones: Feature<Polygon, GeoJsonProperties>[] = geojson.features
        .filter((f): f is Feature<Polygon, GeoJsonProperties> => f.geometry?.type === 'Polygon')
        .map((f) => {
          f.properties = {
            color: 'steelblue'
          };
          f.id = crypto.randomUUID();

          return f;
        });

      drawRef.current?.add({type:'FeatureCollection', features: newZones});
      
      setZones(prev => {
        const zones: ZoneType[] = newZones.map((f: Feature<Polygon>, i: number) => {
          return {
            feature: f,
            name: `Zone-${prev.length + i + 1}`,
          };
        });

        return [...prev, ...zones];
      });
    }

    reader.readAsText(file);
    
  }


  return (
    <div className="w-full portrait:w-full lg:w-2/5 bg-white rounded-xl relative" id="map" style={{ height: '100%' }}>
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
                  zones.forEach((z) => draw.add(z.feature));
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
        </p>
      }
      {isEditing &&
        <button className='absolute top-4 left-4 bg-white p-2 text-black text-sm font-bold rounded-md hover:bg-gray-100'>
          <div className="flex gap-1 items-center">
            <Upload size={17}/>
            <label htmlFor="file-upload" className="custom-file-button">
              Import KML
            </label>
            
          </div>
          <input 
            type="file" 
            id='file-upload' 
            onChange={handleKmlUpload}
            style={{ display: "none" }}  />
        </button>
      }
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