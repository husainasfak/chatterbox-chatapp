import React, { ReactNode } from "react";

interface AvatarGroupProps {
     limit?: number;
     children: ReactNode;
}
const AvatarGroup: React.FC<AvatarGroupProps> = ({ limit = 6, children }) => {
     const avatars = React.Children.toArray(children);
     const totalLength = avatars.length;
     const remaining = totalLength - limit;
     const displayedAvatars = avatars.slice(0, limit)
     return (
          <div className="flex -space-x-4">
               {displayedAvatars.map((child, index) => (
                    <div key={index} className={`relative z-[${index + 1}px]`}>
                         {child}
                    </div>
               ))}
               {remaining > 0 && (
                    <div className="w-10 h-10 rounded-full bg-[#ECECED] flex items-center justify-center text-gray-600 text-sm z-10">
                         +{remaining}
                    </div>
               )}
          </div>
     )
}

export default AvatarGroup