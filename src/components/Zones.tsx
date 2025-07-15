import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Feature, Polygon } from "geojson";
import { area, bbox, length } from "@turf/turf";
import type { MapRef } from "react-map-gl/mapbox";
import type { ZoneType } from "./sites";

type ZonesProps = {
  isEditing: boolean,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
  zones: ZoneType[],
  setZones: Dispatch<SetStateAction<ZoneType[]>>
  mapRef: RefObject<MapRef | null>
};



const Zones: React.FC<ZonesProps> = ({isEditing, setIsEditing, zones, mapRef, setZones}) => {
  const handleClick = () => {
    setIsEditing(!isEditing);
  }
  const changeZoneColor  = (zoneId: number | string | undefined, color: string) => {
    setZones(prev =>
      prev.map(zone =>
        zone.feature.id === zoneId ? { ...zone, feature: {...zone.feature, properties: { color: color }}} : zone
      )
    );

  }
  const moveToZone = (feature: Feature<Polygon>) => {
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
          {zones.map((zone, idx) => <li key={zone.feature.id} onClick={()=>{moveToZone(zone.feature)}} className="bg-gray-100 rounded-md p-2 m-2 font-bold text-sm">
            <p>Zone Name: zone-{idx+1} | area: {area(zone.feature)} m2 | parameter: {length(zone.feature) * 1000} m</p>
            <button onClick={() => {changeZoneColor(zone.feature.id, 'green')}}>green</button>
            <button onClick={() => {changeZoneColor(zone.feature.id, 'yellow')}}>yellow</button>
            <button onClick={() => {changeZoneColor(zone.feature.id, 'brown')}}>brown</button>
            {zone.feature.properties?.color}
          </li>)}
        </ul>
      </div>
    </div>
  );
}

export default Zones;