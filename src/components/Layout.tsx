import { useRef, useState } from "react";
import type { Feature,Polygon } from "geojson";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Options from "./Options";
import Tabs from "./Tabs";
import Map from "./Map";
import Zones from "./Zones";
import type { MapRef } from "react-map-gl/mapbox";

const Layout = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [features, setFeatures] = useState<Feature<Polygon>[]>([]);
  const mapRef = useRef<MapRef | null>(null);

  return(
    <div className="bg-gray-100 w-screen h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 gap-3 m-3">
        <Sidebar />
        <div className="flex-5/6 flex flex-col gap-3">
          <div >
            <Options />
            <Tabs />
          </div>
          <div className="flex flex-1 gap-3">
            <Map isEditing={isEditing} features={features} setFeatures={setFeatures} mapRef={mapRef}/>
            <Zones isEditing={isEditing} setIsEditing={setIsEditing} features={features} mapRef={mapRef}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;


