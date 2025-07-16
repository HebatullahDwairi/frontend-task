import { createContext, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import type { ZoneType } from "../components/sites";
import MapboxDraw from '@mapbox/mapbox-gl-draw';


interface MapContextType {
  mapRef: RefObject<MapRef | null>;
  drawRef: RefObject<MapboxDraw | null>;
  zones: ZoneType[],
  setZones: Dispatch<SetStateAction<ZoneType[]>>
}

const MapContext = createContext<MapContextType | null>(null);


export const MapProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const mapRef = useRef<MapRef | null>(null)
  const drawRef = useRef<MapboxDraw | null>(null);
  const [zones, setZones] = useState<ZoneType[]>([]);


  return(
    <MapContext.Provider value={{mapRef, drawRef, zones, setZones}}>
      {children}
    </MapContext.Provider>
  );
}

export default MapContext;