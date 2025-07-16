import type { Dispatch, SetStateAction } from "react";
import { area, length } from "@turf/turf";
import Table from "./Table";
import useMap from "../hooks/useMap";

type ZonesProps = {
  isEditing: boolean,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
};


const Zones: React.FC<ZonesProps> = ({isEditing, setIsEditing }) => {

  const { zones } = useMap();

  const handleClick = () => {
    setIsEditing(!isEditing);
  }

  return (
    <div className="flex-2/3  bg-white rounded-xl p-4 ">
      <div className="w-full flex justify-between">
        <p className="font-bold">Zones</p>
        <button className="bg-black rounded-md text-white text-sm font-bold p-2 px-3 hover:bg-gray-800 transition-colors"
        onClick={handleClick}>{isEditing? 'Save' : 'Add or Edit'}</button>
      </div>

      
      <Table 
        data={zones.map(z => ({
          zoneName: z.name,
          type: 'idk',
          area: area(z.feature),
          parameter: length(z.feature) * 1000,
          color: z.feature.properties?.color,
          id: z.feature.id
        }))}
      />
    </div>
  );
}

export default Zones;


