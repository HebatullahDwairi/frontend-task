import { House, Box, Users, User, Podcast, MapPinned } from "lucide-react";

export default function Sidebar () {
  return (
    <div className="flex-1/6 bg-white rounded-xl p-5">
      <p className="text-gray-500 text-sm mb-5"><span className="font-bold">CENTER</span> DASHBOARD</p>

      <div className="space-y-2 text-sm">
        <div className="flex rounded-lg gap-2 items-center p-1.5">
          <House color="gray" size={17}/>
          <p className="font-semibold">Dashboard</p>
        </div>
        <div className="flex  rounded-lg gap-2 items-center p-1.5">
          <Box color="gray" size={17}/>
          <p className="font-semibold">Inventory</p>
        </div>
        <div className="flex gap-2 items-center p-1.5">
          <Users color="gray" size={17}/>
          <p className="font-semibold">Clients</p>
        </div>
        <div className="flex gap-2 items-center p-1.5">
          <User color="gray" size={17}/>
          <p className="font-semibold">Pilots</p>
        </div>
        <div className="flex gap-2 items-center p-1.5">
          <Podcast color="gray" size={17}/>
          <p className="font-semibold">Streaming Hub</p>
        </div>
        <div className="flex gap-2 items-center p-1.5 bg-gray-100 rounded-md">
          <MapPinned color="gray" size={17}/>
          <p className="font-semibold">Sites</p>
        </div>
      </div>
    </div>
  );
}

