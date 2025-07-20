import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";


const Layout = () => {

  return(
    <div className="bg-gray-100 w-screen h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 gap-3 m-3 ">
        <Sidebar />
        <div className="flex-1 flex flex-col gap-3">
          <Outlet />
          <div><Toaster position="bottom-center"/></div>
        </div>
      </div>
    </div>
  );
}

export default Layout;


