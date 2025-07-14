import { useRef, useState } from "react";
import type { Feature,Polygon } from "geojson";
import Map from "./Map";
import Zones from "./Zones";
import Options from "./Options";
import Tabs from "./Tabs";
import type { MapRef } from "react-map-gl/mapbox";

const Sites = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [features, setFeatures] = useState<Feature<Polygon>[]>([]);
  const mapRef = useRef<MapRef | null>(null);

  return(
    <>
      <div >
        <Options />
        <Tabs />
      </div>
      <div className="flex flex-1 gap-3">
        <Map isEditing={isEditing} features={features} setFeatures={setFeatures} mapRef={mapRef}/>
        <Zones isEditing={isEditing} setIsEditing={setIsEditing} features={features} mapRef={mapRef}/>
      </div>
    </>
  );
}



export default Sites;