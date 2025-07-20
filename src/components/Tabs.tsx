import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import ZonesTab from './zonesTab';


const Tabs = () => {

  const tabNames = [
    'Site Main Information',
    'Dashboard',
    'Media',
    'Documentation',
    'Zones',
    'Assets',
    'Cloud'
  ];

  return (
    <TabGroup className='flex-1 flex flex-col'>
      <div className="h-10 p-3">
        <TabList className="flex gap-3 text-sm text-gray-500 font-semibold ">
          {tabNames.map(tab => 
            <Tab className='data-selected:border-b-2 border-red-600' key={tab}>
              {tab}
            </Tab>)}
        </TabList>
      </div>
     
        <TabPanels className={'flex flex-1'}>
          <TabPanel>Site information</TabPanel>
          <TabPanel>Dashboard</TabPanel>
          <TabPanel>Media</TabPanel>
          <TabPanel>Documentation</TabPanel>
          <TabPanel className='w-full flex gap-3 flex-col lg:flex-row portrait:flex-col'>
            <ZonesTab />
          </TabPanel>
          <TabPanel>assets</TabPanel>
          <TabPanel>cloud</TabPanel>
        </TabPanels>
   
    </TabGroup>
  );
}

export default Tabs;