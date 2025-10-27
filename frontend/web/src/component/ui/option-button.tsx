import Image from "next/image";

interface OptionButtonProps {
    icon: string;
    label: string;
    href?: string;
    onClick?: () => void;
}

export default function OptionButton({ icon, label, onClick,href}: OptionButtonProps) {
   if (href) {
    return (
      <a href={href} className="block">
        { <button
            onClick={onClick}
            className="flex items-center gap-3 px-8 py-4 border-2 border-[#3FA9D9] 
             text-[#3FA9D9] rounded-full hover:bg-[#3FA9D9] hover:text-white 
             transform hover:scale-110 transition-all duration-800 ease-in-out"
        >
            <Image src={icon} alt={label} width={32} height={32} />
            <span className="text-xl">{label}</span>
        </button>}
      </a>
    )
  }
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-8 py-4 border-2 border-[#3FA9D9] 
             text-[#3FA9D9] rounded-full hover:bg-[#3FA9D9] hover:text-white 
             transform hover:scale-110 transition-all duration-800 ease-in-out"
        >
            <Image src={icon} alt={label} width={32} height={32} />
            <span className="text-xl">{label}</span>
        </button>


    );
}