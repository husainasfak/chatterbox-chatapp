import { Files, FileVideo, Headphones, Image } from "lucide-react"



const Document = () => {
    return (
        <div className="bg-white py-2 px-1">
            <div className="flex items-center gap-2 my-2 cursor-pointer px-6 py-1 hover:bg-[#ececedd5] hover:rounded-md">
                <Image size={18} />
                <p>Image</p>
            </div>
            <div className="flex items-center gap-2 my-2 cursor-pointer px-6 py-1 hover:bg-[#ececedd5] hover:rounded-md">
                <Headphones size={18} />
                <p>Audio</p>
            </div>
            <div className="flex items-center gap-2 my-2 cursor-pointer px-6 py-1 hover:bg-[#ececedd5] hover:rounded-md">
                <FileVideo size={18} />
                <p>Video</p>
            </div>
            <div className="flex items-center gap-2 my-2 cursor-pointer px-6 py-1 hover:bg-[#ececedd5] hover:rounded-md">
                <Files size={18} />
                <p>Documents</p>
            </div>

        </div>
    )
}

export default Document