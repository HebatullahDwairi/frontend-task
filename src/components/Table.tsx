import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table'
import useMap from '../hooks/useMap';
import type { ZoneType } from './sites';
import { bbox } from '@turf/turf';
import EditableTextCell from './Table/EditableTextCell';
import DeletionModal from './Table/DeletionModal';
import ColorSelectorMenu from './Table/ColorSelectorMenu';
import { useState } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';


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
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 6,
    pageIndex: 0
  });

  /*const [selected, setSelected] = useState(null);

  useEffect(() => {
    if(selected) {
      moveToZone(selected);
    }
  }, [selected]);
*/
  
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
      cell: info => info.getValue() > 1000000 ? 
        <p> {Math.round(info.getValue()/1000000)} km<sup>2</sup> </p>:
        <p> {Math.round(info.getValue())} m<sup>2</sup> </p>,
    }),
    colHelper.accessor('parameter', {
      header: "Parameter",
      cell: info => `${
        info.getValue() > 1000 ?
        Math.round(info.getValue()/1000) + ' km' 
        :
         Math.round(info.getValue()) + ' m'}`,
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
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    }
  })

  return (
    <div className="p-2 flex flex-col justify-between flex-1">
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
      <div className=' flex justify-between mt-1 p-2'>
        <p className=' text-sm p-1 border-gray-300  border-1 rounded-md'>
          Page: {pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className='flex gap-2'>
          <button 
            disabled={!table.getCanPreviousPage()} 
            onClick={() => { table.previousPage() }}
            className=' border-1 border-gray-300 rounded-md'
          >

            <ChevronLeft size={22} />
          </button>
          <button 
            disabled={!table.getCanNextPage()} 
            onClick={() => { table.nextPage()}}
            className=' border-1 border-gray-300 rounded-md'
          >

            <ChevronRight size={22}/>
          </button>
        </div>
      </div>
    </div>
  )
}

