import type { Dispatch, SetStateAction } from "react";
import { area, length } from "@turf/turf";
import Table from "./Table";
import useMap from "../hooks/useMap";
import toast from "react-hot-toast";

type ZonesProps = {
  isEditing: boolean,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
};


const Zones: React.FC<ZonesProps> = ({isEditing, setIsEditing }) => {

  const { zones } = useMap();

  const handleClick = () => {
    if(isEditing) {
      toast.success('Zones saved!');
    }
    setIsEditing(!isEditing);
  }

  return (
    <div className="flex-2/3  bg-white rounded-xl p-4 ">
      <div className="w-full flex justify-between">
        <p className="font-bold">Zones</p>
        <button  
          className="bg-black rounded-md text-white text-sm font-bold p-2 px-3 hover:bg-gray-800 transition-colors"
          onClick={handleClick}
        >
          {isEditing? 'Save' : 'Add or Edit'}
        </button>
      </div>

      
      <div className="w-full flex flex-col ">
        {zones.length > 0 ? <Table
          data={zones.map(z => ({
            zoneName: z.name,
            type: 'type',
            area: area(z.feature),
            parameter: length(z.feature) * 1000,
            color: z.feature.properties?.color,
            id: z.feature.id,
            actions:''
          }))}
          isEditing={isEditing}
        />:
        <div className="text-lg font-bold text-gray-400 text-center mt-24">
          No Zones Available Yet
          <p className="text-xs font-medium p-1">you can add zones by drawing on the map</p>
        </div>
        }
      </div>
    </div>
  );
}

export default Zones;


