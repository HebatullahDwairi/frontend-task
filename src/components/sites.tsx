import type { Feature,Polygon } from "geojson";
import Options from "./Options";
import Tabs from "./Tabs";


export type ZoneType ={
  feature: Feature<Polygon>,
  name: string
};

const Sites = () => {
  return(
    <>
      <Options />
      <Tabs />
    </>
  );
}



export default Sites;

