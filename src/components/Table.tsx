import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type CellContext,
} from '@tanstack/react-table'
import useMap from '../hooks/useMap';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { Trash } from 'lucide-react';
import type { ZoneType } from './sites';
import { bbox } from '@turf/turf';
import { useEffect, useState } from 'react';
import {  Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

type ZoneRow = {
  color: string,
  zoneName: string,
  type: string,
  area: number,
  parameter: number,
  id: number,
  actions: string,
}

type TableProps = {
  data: ZoneRow[],
  isEditing: boolean
};



const EditableTextCell = ({ isEditing , info, type }: {isEditing: boolean, info: CellContext<ZoneRow, string>, type:string}) => {
  const intialValue = info.getValue();
  const [value, setValue] = useState(intialValue);
  
  useEffect(() => {
    setValue(intialValue);
  }, [intialValue]);

 const {setZones} = useMap();


  const updateState = () => {
   if(type === 'name') {
     setZones(prev => prev.map(z => (z.feature.id === info.row.original.id ? {...z, name: value} : z)));
   }
   else {
    setZones(prev => prev.map(z => (z.feature.id === info.row.original.id ? {...z, type: value} : z)));
   }
  }

  return(
    <div>
      {isEditing ? <input className='w-4/5 border-1 border-gray-700 rounded-sm p-1 bg-white' value={value}  onBlur={updateState} onChange={(e) => {setValue(e.target.value)}}/>
      : 
      <p>{info.getValue()}</p>}
    </div>
  );
}

const DeletionModal = ({id, zoneName}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {setZones, drawRef} = useMap();

  const deleteZone = (id: number) => {
    drawRef.current?.delete(String(id));
    setZones(prev => prev.filter(z => z.feature.id !== id));
  }

  return (
  <>
    <button onClick={() => setIsOpen(true)}><Trash size={17} color='#e00010'/></button>
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 rounded-lg bg-white p-8 border-2 border-gray-200 shadow-md">
          <DialogTitle className="font-bold">Delete Zone</DialogTitle>
          <p>{`Are you sure you want to delete zone ${zoneName} ?`}</p>
          <div className="flex gap-3 flex-row-reverse">
            <button className='bg-red-500 text-white rounded-md p-2 font-bold text-sm hover:bg-red-400' onClick={() => {
              setIsOpen(false)
              deleteZone(id);
            }}>Delete</button>
            <button className='bg-black text-white rounded-md p-2 font-bold text-sm hover:bg-gray-800 ' onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </>
  )
}


const ColorSelectorMenu = ({isEditing, info}) => {
  const currColor = info.getValue();
  const {drawRef, setZones} = useMap();
  const changeZoneColor  = (zoneId: number | string | undefined, color: string) => {
    const id = String(zoneId);

    if(isEditing) {
      drawRef.current?.setFeatureProperty(id, 'color', color);
      const zone = drawRef.current?.get(id);
      drawRef.current?.delete(id);
      drawRef.current?.add(zone);
      setZones(prev =>
        prev.map(zone =>
          zone.feature.id === zoneId ? { ...zone, feature: {...zone.feature, properties: { color: color }}} : zone
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
      <ListboxButton className="w-5 h-5 rounded-full" style={{backgroundColor: currColor}}></ListboxButton>
      <ListboxOptions anchor="bottom" className="flex gap-2 bg-gray-800 rounded-md ml-9 mt-3 p-2 text-white z-10">
        {colorOptions.map((color) => (
          <ListboxOption key={color} value={color} className="data-focus:bg-gray-700 data-focus:rounded-full">
            <div className='w-5 h-5 rounded-full' style={{backgroundColor: color}}></div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

export default function Table({data, isEditing}: TableProps) {

  const { mapRef, zones } = useMap();

  
  const moveToZone = (id: number) => {
    const zone : ZoneType[] = zones.filter(z => z.feature.id === id);
    if (zone) {
      const [minLng, minLat, maxLng, maxLat] = bbox(zone[0].feature);

      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        {padding: 40, duration: 1000}
      );
    }
  }

  const colHelper = createColumnHelper<ZoneRow>()
  const cols = [
    colHelper.accessor('color', {
      cell: info => isEditing? <ColorSelectorMenu info={info} isEditing={isEditing} /> 
          :  
        <div className='w-5 h-5 rounded-full mx-auto' style={{backgroundColor: info.getValue()}}></div>,   
      header: "Color"
    }),
    colHelper.accessor('zoneName', {
      header: "Zone Name",
      cell: info => <EditableTextCell info={info} isEditing={isEditing} type='name'/>,
      size:250
    }),
    colHelper.accessor('type', {
      header: "Type",
      cell: info => <EditableTextCell info={info} isEditing={isEditing} type='type'/>,
      size:250
    }),
    colHelper.accessor('area', {
      header: "Area",
      cell: info => `${(info.getValue()).toFixed(1)} m2`,
    }),
    colHelper.accessor('parameter', {
      header: "Parameter",
      cell: info => `${(info.getValue()).toFixed(1)} m`,
    }),
    colHelper.accessor('actions', {
      header: "Actions",
      cell: info => <DeletionModal id={info.row.original.id} zoneName={info.row.original.zoneName}/>
    }),
  ];

  
  const table = useReactTable({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  })

  return (
    <div className="p-2">
      <table className='w-full'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='border-b-1 border-gray-300'>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='p-3 text-sm' style={{ width: header.column.getSize() }}>
                  {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} 
              onClick={() => {moveToZone(row.original.id)}}
              className='border-b-1 border-gray-200  hover:bg-gray-100 '> 
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='p-3 text-sm text-center '>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}