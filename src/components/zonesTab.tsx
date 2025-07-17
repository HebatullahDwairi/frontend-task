import { useState } from "react";
import type { Feature,Polygon } from "geojson";
import Map from "./Map";
import Zones from "./Zones";
import { MapProvider } from "../contexts/MapContext";

export type ZoneType ={
  feature: Feature<Polygon>,
  name: string
};

const ZonesTab = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return(
      <MapProvider>
        <Map isEditing={isEditing} />
        <Zones isEditing={isEditing} setIsEditing={setIsEditing} />
      </MapProvider>
  );
}



export default ZonesTab;