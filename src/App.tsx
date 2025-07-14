import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Sites from "./components/sites"

const Dashboard = () =>  <div>Dashboard</div>
const Inventory = () =>  <div>Inventory</div>
const Pilots = () => <div>Pilots</div>
const StreamingHub = () => <div>streaming hub</div>
const Clients = () => <div>clients</div>

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="sites" index  element={<Sites />}/>
          <Route path="inventory" index  element={<Inventory />}/>
          <Route path="pilots" index  element={<Pilots />}/>
          <Route path="streaming-hub" index  element={<StreamingHub />}/>
          <Route path="clients" index  element={<Clients />}/>
          <Route path="dashboard" index  element={<Dashboard />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
