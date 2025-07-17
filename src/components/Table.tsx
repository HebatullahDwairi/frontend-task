import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import useMap from '../hooks/useMap';
import type { ZoneType } from './sites';
import { bbox } from '@turf/turf';
import EditableTextCell from './Table/EditableTextCell';
import DeletionModal from './Table/DeletionModal';
import ColorSelectorMenu from './Table/ColorSelectorMenu';


export type ZoneRow = {
  color: string,
  zoneName: string,
  type: string,
  area: number,
  parameter: number,
  id: number | string | undefined,
  actions: string,
}

type TableProps = {
  data: ZoneRow[],
  isEditing: boolean
};



export default function Table({data, isEditing}: TableProps) {

  const { mapRef, zones } = useMap();

  
  const moveToZone = (id: number | string | undefined) => {
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
              className='border-b-1 border-gray-200  hover:bg-gray-100 '> 
              {row.getVisibleCells().map(cell => (
                
                <td key={cell.id} 
                  className='p-3 text-sm text-center '
                  onClick={() => { 
                    if(!['color', 'actions'].includes(cell.column.id)){
                      moveToZone(row.original.id);
                    }
                  } 
                }>
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

