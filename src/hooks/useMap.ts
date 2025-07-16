import { useContext } from "react";
import MapContext from "../contexts/MapContext";

const useMap = () => {
  const mapContext = useContext(MapContext);

  if(!mapContext) {
    throw new Error('map context must be used within a map context provider');
  }

  return mapContext;
}

export default useMap;