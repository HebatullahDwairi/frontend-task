const Tabs = () => {
  return (
    <div className="h-10 p-3">
      <ul className="flex gap-3 text-sm text-gray-500 font-semibold">
        <li >Site main information</li>
        <li>Dashboard</li>
        <li>Media</li>
        <li>Documentation</li>
        <li className="border-b-2 border-red-600 hover:bg-gray-200">Zones</li>
        <li>assets</li>
        <li>cloud</li>
      </ul>
    </div>
  );
}

export default Tabs;