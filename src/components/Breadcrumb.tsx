import { House } from "lucide-react";

const Breadcrumb = () => {
  return (
    <div className="text-gray-500 flex gap-1 items-center font-semibold text-sm">
      <House color="gray" size={17}/>
      <p>&gt;</p> 
      <p>sites</p>
      <p>&gt;</p> 
      <p className="text-red-600">example site</p>
    </div>
  );
}

export default Breadcrumb;