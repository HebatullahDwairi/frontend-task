import { House, Box, Users, User, Podcast, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {name: 'Dashboard', icon: House, to: '/dashboard'},
  {name: 'Inventory', icon: Box, to: '/inventory'},
  {name: 'Clients', icon: Users, to: '/clients'},
  {name: 'Pilots', icon: User, to: '/pilots'},
  {name: 'Sites', icon: MapPinned, to: '/sites'},
  {name: 'Streaming Hub', icon: Podcast, to: '/streaming-hub'},
];


export default function Sidebar () {
  return (
    <div className="flex-1/6 bg-white rounded-xl p-5">
      <p className="text-gray-500 text-sm mb-5"><span className="font-bold">CENTER</span> DASHBOARD</p>
      <div className="space-y-2 text-sm">

        {links.map(({name, icon: Icon, to}) => (
          <NavLink to={to} key={name} className={({isActive}) => `flex gap-2 items-center p-1.5 rounded-md ${isActive && "bg-gray-100"}`}>
            <Icon size={17} />
            <p className="font-semibold">{name}</p>
          </NavLink>
        ))}
      </div>


    </div>
  );
}

