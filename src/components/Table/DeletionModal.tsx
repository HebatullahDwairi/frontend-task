import {  Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import useMap from '../../hooks/useMap';
import { Trash } from 'lucide-react';


const DeletionModal = ({id, zoneName} : {id: number | string | undefined, zoneName: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {setZones, drawRef} = useMap();

  const deleteZone = (id: number | string | undefined) => {
    drawRef.current?.delete(String(id));
    setZones(prev => prev.filter(z => z.feature.id !== id));
  }

  return (
  <>
    <button onClick={() => setIsOpen(true)}><Trash size={17} color='#e00010'/></button>
    <Dialog 
      open={isOpen} 
      onClose={() => setIsOpen(false)} 
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/20 p-4 
                 transition duration-150 ease-out data-closed:opacity-0 z-20 backdrop-blur-xs">
      
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 rounded-xl bg-white p-6  shadow-md">
          <DialogTitle className="font-bold">Delete Zone</DialogTitle>
          <p>{`Are you sure you want to delete zone ${zoneName} ?`}</p>
          <div className="flex gap-3 flex-row-reverse">
            <button className='bg-red-500 text-white rounded-md p-2 font-bold text-sm hover:bg-red-400' 
              onClick={() => {
                setIsOpen(false)
                deleteZone(id);
              }}>
              Delete
            </button>
            <button 
              className='bg-black text-white rounded-md p-2 font-bold text-sm hover:bg-gray-800 ' 
              onClick={() => setIsOpen(false)}>Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </>
  );
}

export default DeletionModal;