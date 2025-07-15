
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxMap, { NavigationControl, FullscreenControl, useControl, type MapRef } from 'react-map-gl/mapbox';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useRef, type Dispatch, type SetStateAction, type RefObject} from 'react';
import type { Feature, Polygon } from 'geojson';
import { Source, Layer } from 'react-map-gl/mapbox';
import type { ZoneType } from './sites';
import DrawDefaultStyles from '../MapBoxDrawDefaultTheme'

type MapProps = {
  isEditing: boolean,
  zones: ZoneType[],
  setZones: Dispatch<SetStateAction<ZoneType[]>>
  mapRef: RefObject<MapRef | null>
};


type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  onCreate: (e: { features: [] }) => void,
  onUpdate: (e: { features: [], action: string }) => void,
  onDelete: (e: { features: [] }) => void,
  onInit?: (draw: MapboxDraw) => void
};


const DrawControl = (props: DrawControlProps) => {
  useControl<MapboxDraw>(() => {
    const draw = new MapboxDraw(props);
    props.onInit?.(draw);
    return draw;
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




const Map: React.FC<MapProps> = ({ isEditing, zones, setZones, mapRef }) => {

  const drawRef = useRef<MapboxDraw | null>(null);



  const onCreate = (e: { features: [] }) => {
    const newZones: ZoneType[] = e.features.map((f: Feature<Polygon>) => {
      f.properties = {
        color: 'red'
      }
      
      return {
        feature: f,
        name: "some name",
      }
    });

    setZones(prev => [...prev, ...newZones]);
  }

  const onUpdate = (e: { features: Feature<Polygon>[] }) => {
    setZones(prev => prev.map((zone: ZoneType) => {

      if (zone.feature.id === e.features[0].id) {
        const updatedZone: ZoneType = {
          ...zone,
          feature: e.features[0],
        }

        return updatedZone;
      }
      else
        return zone;
    }));
  }

  const onDelete = (e: { features: Feature<Polygon>[] }) => {
    setZones(zones.filter((zone) => zone.feature.id !== e.features[0].id));
  }


  return (
    <div className="w-1/3 bg-white rounded-xl relative" id="map" style={{ height: '100%' }}>
      <MapboxMap
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        ref={mapRef}
        initialViewState={{
          longitude: 35.9,
          latitude: 31.9,
          zoom: 12,
        }}
        mapStyle={'mapbox://styles/mapbox/satellite-v9'}
        style={{
          borderRadius: "10px",
        }}

      >
        <NavigationControl />
        <FullscreenControl />
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

export default Map;