interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  items: T[];
  columns: Column<T>[];
  rowKey: (item: T) => React.Key;
}

export default function DataTable<T>({ items, columns, rowKey }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {columns.map((column) => (
              <th
                key={column.header}
                className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={rowKey(item)}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
