import { Plus } from "lucide-react"


const Group = () => {
     return (
          <div className="bg-white  px-4 rounded-3xl h-[230px] overflow-y-auto">
               <div className="py-4 bg-white sticky top-0 flex justify-between items-center">
                    <p className="font-head font-bold">Groups</p>
                    <Plus className="cursor-pointer" />
               </div>


          </div>
     )
}

export default Group