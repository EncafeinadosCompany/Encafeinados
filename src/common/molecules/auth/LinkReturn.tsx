import { ArrowLeft } from "@/common/ui/icons"
import { Link } from "react-router-dom"

interface LinkReturnProps {
    link: string
    className?:string
}
export const LinkReturn = ({link, className}:LinkReturnProps) => {
    return (
        <div className="w-full max-w-2xl mb-2 px-4 sm:px-0">
            <Link
            to={link}
            className={`
                inline-flex items-center gap-2
                text-brown-700 hover:text-amber-900
                text-base sm:text-sm font-medium
                transition-colors duration-200
                border-b-2 border-transparent hover:border-amber-900
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-opacity-60
                rounded p-1
                ${className ?? ""}
            `}
            aria-label="Volver"
            >
            <ArrowLeft className="w-5 h-5 opacity-80" />
            <span>Volver</span>
            </Link>
        </div>
    )
}