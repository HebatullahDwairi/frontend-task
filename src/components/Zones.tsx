import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Feature, Polygon } from "geojson";
import { area,bbox, length } from "@turf/turf";
import type { MapRef } from "react-map-gl/mapbox";

type ZonesProps = {
  isEditing: boolean,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
  features: Feature<Polygon>[],
  mapRef: RefObject<MapRef | null>
};

const Zones: React.FC<ZonesProps> = ({isEditing, setIsEditing, features, mapRef}) => {
  const handleClick = () => {
    setIsEditing(!isEditing);
  }
  const moveToZone = (feature) => {
    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        {padding: 40, duration: 1000}
      );
    }
  }

  return (
    <div className="flex-2/3  bg-white rounded-xl p-4 ">
      <div className="w-full flex justify-between">
        <p className="font-bold">Zones</p>
        <button className="bg-black rounded-md text-white text-sm font-bold p-2 px-3 hover:bg-gray-800 transition-colors"
        onClick={handleClick}>{isEditing? 'Save' : 'Add or Edit'}</button>
      </div>

      <div>

        <ul>
          {features.map((feature, idx) => <li key={feature.id} onClick={()=>{moveToZone(feature)}} className="bg-gray-100 rounded-md p-2 m-2 font-bold text-sm">
            <p>Zone Name: zone-{idx+1} | area: {area(feature)} m2 | parameter: {length(feature) * 1000} m</p>
          </li>)}
        </ul>
      </div>
    </div>
  );
}

export default Zones;