import { cn } from "../../utils/tailwind-utils";

type AvatarType = {
     src: string;
     width?: number;
     alt?: string;
     className?: string;
     isOnline: boolean | null
}
const Avatar = ({ src, width = 40, alt, className, isOnline }: AvatarType) => {
     return (
          <div className="relative">
               <img src={src} alt={alt} width={width} height={width} className={cn('rounded-full shadow-md', className)} />
               {
                    isOnline && <div className="w-[13px] h-[13px] bg-green-700 rounded-full border-white border-2 absolute -right-1 bottom-[0px]"></div>
               }

          </div>

     )
}

export default Avatar