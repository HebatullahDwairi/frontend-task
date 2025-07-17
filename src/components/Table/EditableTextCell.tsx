import type { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import useMap from "../../hooks/useMap";
import type { ZoneRow } from "../Table";

const EditableTextCell = ({ isEditing , info, type }:
  {isEditing: boolean, info: CellContext<ZoneRow, string>, type:string}) => {


  const intialValue = info.getValue();
  const [value, setValue] = useState(intialValue);
  
  useEffect(() => {
    setValue(intialValue);
  }, [intialValue]);

  const {setZones} = useMap();


  const updateState = () => {
    // this should be updated to support other types
   if(type === 'name') {
     setZones(prev => prev.map(z => (z.feature.id === info.row.original.id ? {...z, name: value} : z)));
   }
   else {
    setZones(prev => prev.map(z => (z.feature.id === info.row.original.id ? {...z, type: value} : z)));
   }
  }

  return(
    <div>
      {isEditing ? 
        <input 
          className='w-4/5 border-1 border-gray-700 rounded-sm p-1 bg-white' 
          value={value}  
          onBlur={updateState} 
          onChange={(e) => {setValue(e.target.value)}}
        />
          : 
        <p>{info.getValue()}</p>}
    </div>
  );
}

export default EditableTextCell;