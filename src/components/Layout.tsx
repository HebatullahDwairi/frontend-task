import Header from "./Header";
import Sidebar from "./Sidebar";
import Options from "./Options";
import Tabs from "./Tabs";
import Map from "./Map";
import Zones from "./Zones";

const Layout = () => {
  return(
    <div className="bg-gray-100 w-screen h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 gap-3 m-3">
        <Sidebar />
        <div className="flex-5/6 flex flex-col gap-3">
          <div >
            <Options />
            <Tabs />
          </div>
          <div className="flex flex-1 gap-3">
            <Map />
            <Zones />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;


