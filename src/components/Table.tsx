import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'



type ZoneRow = {
  color: string,
  zoneName: string,
  type: string,
  area: number,
  parameter: number,
}

const mockData: ZoneRow[] = [
  {
    color: 'red', 
    zoneName: 'zone-1',
    type: 'idk',
    area: 323,
    parameter: 211
  },
  {
    color: 'green', 
    zoneName: 'zone-2',
    type: 'idk2',
    area: 234,
    parameter: 89
  }
];


const colHelper = createColumnHelper<ZoneRow>()
const cols = [
  colHelper.accessor('zoneName', {
    cell: info => info.getValue(),
   
  }),
  colHelper.accessor('type', {
    cell: info => info.getValue(),
  }),
  colHelper.accessor('color', {
    cell: info => info.getValue(),
  }),
  colHelper.accessor('area', {
    cell: info => info.getValue(),
  }),
  colHelper.accessor('parameter', {
    cell: info => info.getValue(),

  }),
];

export default function Table({data}) {
  
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
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
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
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
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