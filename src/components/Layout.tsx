import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {

  return(
    <div className="bg-gray-100 w-screen h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 gap-3 m-3">
        <Sidebar />
        <div className="flex-5/6 flex flex-col gap-3">
          <Outlet />
          
        </div>
      </div>
    </div>
  );
}

export default Layout;


