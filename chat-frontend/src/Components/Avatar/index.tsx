
type AvatarType = {
     src: string;
     width?: number;
     alt?: string;
}
const Avatar = ({ src, width = 40, alt }: AvatarType) => {
     return (
          <img src={src} alt={alt} width={width} height={width} className='rounded-full shadow-md' />
     )
}

export default Avatar