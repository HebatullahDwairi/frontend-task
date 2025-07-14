import { CircleUser,Bell, CloudSun } from "lucide-react";

export default function Header () {
  return (
    <div className="w-screen bg-white p-2 shadow-xm flex justify-between items-center">
      <p className="font-black text-xl italic">SAGER</p>
      <input type="text" placeholder="search" className="border-gray-300 border rounded-md p-1"/>
      <div className="flex gap-3 items-center text-gray-800">
        <p>13:20PM | </p>
        <CloudSun size={16} color="teal"/>
        <p>33</p>
      </div>
      <div className="flex gap-3 items-center">
        <Bell size={17} color="gray"/>
        <CircleUser  size={24} color="gray"/>
      </div>
    </div>
  );
}
