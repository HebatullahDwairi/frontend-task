
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxMap, {NavigationControl, FullscreenControl, useControl, type MapRef} from 'react-map-gl/mapbox';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useRef, type Dispatch, type SetStateAction, type RefObject } from 'react';
import type {Feature, Polygon} from 'geojson';
import { Source,Layer } from 'react-map-gl/mapbox';


type MapProps = {
  isEditing: boolean,
  features: Feature<Polygon>[],
  setFeatures: Dispatch<SetStateAction<Feature<Polygon>[]>>
  mapRef: RefObject<MapRef | null>
};

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  onCreate: (e: {features: []}) => void,
  onUpdate: (e: {features: [], action: string}) => void,
  onDelete: (e: {features: []}) => void,
  onInit?: (draw: MapboxDraw) => void
};


const DrawControl = (props: DrawControlProps) => {
  useControl<MapboxDraw>(() => {
    const draw = new MapboxDraw(props);
    props.onInit?.(draw);
    return draw;
  }, 
  ({map}) => {
    map.on('draw.create', props.onCreate);
    map.on('draw.update', props.onUpdate);
    map.on('draw.delete', props.onDelete);
  },
  ({map}) => {
    map.off('draw.create', props.onCreate);
    map.off('draw.update', props.onUpdate);
    map.off('draw.delete', props.onDelete);
  });

  return null;
}





const Map: React.FC<MapProps> = ({isEditing, features, setFeatures, mapRef}) => {
 
  const drawRef = useRef<MapboxDraw | null>(null);

  const onCreate = (e: {features: []}) => {
    setFeatures(prev => [...prev, ...e.features]);
  }

  const onUpdate = (e: {features: []}) => {
     requestAnimationFrame(() =>{
      setFeatures(prev => prev.map(f => (f.id === e.features[0].id ? e.features[0] : f)));
     })
  }

  const onDelete = (e: {features: []}) => {
    setFeatures(features.filter((f) => f.id !== e.features[0].id));
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
          onInit={(draw) => {
            drawRef.current = draw;
            requestAnimationFrame(() => {
              if (isEditing) {
                try {
                  draw.deleteAll();
                  features.forEach((f) => draw.add(f));
                }
                catch(err) {
                  console.log(err);
                }
              }
            });
          }}
        />}
        {!isEditing && features.length > 0 && (
          <Source id="zones" type="geojson" data={{ type: 'FeatureCollection', features: features }}>
            <Layer
              id="zone-fill"
              type="fill"
              paint={{ 'fill-color': '#088', 'fill-opacity': 0.4 }}
            />
            <Layer
              id="zone-outline"
              type="line"
              paint={{ 'line-color': '#000', 'line-width': 2 }}
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