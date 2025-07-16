import { useState } from "react";
import type { Feature,Polygon } from "geojson";
import Map from "./Map";
import Zones from "./Zones";
import Options from "./Options";
import Tabs from "./Tabs";
import { MapProvider } from "../contexts/MapContext";

export type ZoneType ={
  feature: Feature<Polygon>,
  name: string
};

const Sites = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return(
    <>
      <div >
        <Options />
        <Tabs />
      </div>
      <div className="flex flex-1 gap-3">
        <MapProvider>
          <Map isEditing={isEditing} />
          <Zones isEditing={isEditing} setIsEditing={setIsEditing} />
        </MapProvider>
      </div>
    </>
  );
}



export default Sites;