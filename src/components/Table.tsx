import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import useMap from '../hooks/useMap';



type ZoneRow = {
  color: string,
  zoneName: string,
  type: string,
  area: number,
  parameter: number,
  id: number,
}



export default function Table({data}) {

  const {drawRef, mapRef, setZones} = useMap();

  const changeZoneColor  = (zoneId: number | string | undefined, color: string) => {
    const id = String(zoneId);
    
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

  const colHelper = createColumnHelper<ZoneRow>()
  const cols = [
    colHelper.accessor('zoneName', {
      cell: info => info.getValue(),
    
    }),
    colHelper.accessor('type', {
      cell: info => info.getValue(),
    }),
    colHelper.accessor('color', {
      cell: info => <div>
        {info.getValue()}
          <button onClick={() => {changeZoneColor(info.row.original.id, 'green')}}>green</button>
          <button onClick={() => {changeZoneColor(info.row.original.id, 'yellow')}}>yellow</button> 
          <button onClick={() => {changeZoneColor(info.row.original.id, 'brown')}}>brown</button>
      </div>,
    }),
    colHelper.accessor('area', {
      cell: info => `${(info.getValue()).toFixed(1)} m2`,
    }),
    colHelper.accessor('parameter', {
      cell: info => `${(info.getValue()).toFixed(1)} m`,

    }),
  ];


  
  const table = useReactTable({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='border-b-1 border-gray-400'>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='p-3'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
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
            <tr key={row.id} className='border-b-1 border-gray-300 bg-gray-100'>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='p-2 '>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}