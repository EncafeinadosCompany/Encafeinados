import { ArrowLeft } from "@/common/ui/icons"
import { Link } from "react-router-dom"

interface LinkReturnProps {
    link: string
    className?:string
}
export const LinkReturn = ({link, className}:LinkReturnProps) => {
    return (
        <div className="w-full max-w-2xl mb-6 px-4 sm:px-0">
            <Link 
                to={link} 
                className={`
                    inline-flex items-center 
                    text-brown-600 hover:text-amber-800
                    text-base sm:text-sm font-light
                    transition-all duration-300 ease-in-out
                    border-b border-transparent hover:border-amber-800
                    focus:outline-none focus:ring-2 focus:ring-amber-800 focus:ring-opacity-50
                    rounded-md p-1
                    ${className}
                `}
                aria-label="Go back"
            >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 opacity-70" />
                Volver
            </Link>
        </div>
    )
}