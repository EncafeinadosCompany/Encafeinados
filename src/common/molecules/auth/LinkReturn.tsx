
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

interface LinkReturnProps {
    link: string
    className?:string
}


export const LinkReturn = ({link, className}:LinkReturnProps) => {
    return (
        <div className="sm:max-w-2xl mb-4 self-start">
            <Link to={link} className={`inline-flex items-center text-gray-800 hover:text-gray-700 transition-colors ${className}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
            </Link>
        </div>
    )
}