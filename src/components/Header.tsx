import { CircleUser,Bell, CloudSun } from "lucide-react";

export default function Header () {
  const date= new Date();
  const hour = date.getHours();
  const mins = date.getMinutes();

  return (
    <div className="w-screen bg-white shadow-xm ">
      <div className="p-2 flex justify-between items-center mx-auto max-w-7xl">
        <p className="font-black text-xl italic portrait:ml-17">SAGER</p>
        <input type="text" placeholder="search" className="border-gray-300 border rounded-md p-1"/>
        <div className="flex gap-3 items-center text-gray-800">
          <p>{hour}:{mins} </p>
          <CloudSun size={16} color="teal"/>
          <p>33</p>
        </div>
        <div className="flex gap-3 items-center">
          <Bell size={19} color="gray"/>
          <CircleUser  size={24} color="gray"/>
        </div>
      </div>
    </div>
  );
}
