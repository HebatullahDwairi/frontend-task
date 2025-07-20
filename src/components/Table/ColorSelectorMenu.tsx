import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import useMap from '../../hooks/useMap';
import type { CellContext } from '@tanstack/react-table';
import type { ZoneRow } from '../Table';

const ColorSelectorMenu = ({isEditing, info}:
  { isEditing: boolean, info: CellContext<ZoneRow, string> }) => {

  const currColor = info.getValue();
  const {drawRef, setZones} = useMap();

  const changeZoneColor  = (zoneId: number | string | undefined, color: string) => {
    const id = String(zoneId);

    if(isEditing) {
      drawRef.current?.setFeatureProperty(id, 'color', color);
      const zone = drawRef.current?.get(id);
      if(zone) {
        drawRef.current?.delete(id);
        drawRef.current?.add(zone);
      }
      setZones(prev =>
        prev.map(zone =>
          zone.feature.id === zoneId ? 
            { ...zone,
              feature: {
                ...zone.feature,
                properties: { color: color }
              }
            } 
          : zone
        )
      );
    }

  }

 const colorOptions = [
  'steelblue',
  'Turquoise',
  '#7bc043',
  '#fdf498',
  '#f37736',
  '#ee4035',
];


  return (
    <Listbox value={currColor} onChange={(c) => {
      changeZoneColor(info.row.original.id, c);
    }} >
      <ListboxButton 
        className="w-5 h-5 rounded-full" 
        style={{backgroundColor: currColor}}>
          
      </ListboxButton>

      <ListboxOptions 
        anchor="bottom" 
        transition
        className="flex gap-2 bg-gray-800 rounded-md ml-9 mt-3 p-2 text-white z-10 origin-top 
                   transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
        >

        {colorOptions.map((color) => (
          <ListboxOption 
            key={color} 
            value={color} 
            className="data-focus:bg-gray-700 data-focus:rounded-full"
          >
            <div className='w-5 h-5 rounded-full' style={{backgroundColor: color}}></div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

export default ColorSelectorMenu;