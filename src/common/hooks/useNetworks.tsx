import { LinkIcon, Phone } from "lucide-react";

export const UseNetworkInputConfig = (networkName: string) => {
    const lowerName = networkName?.toLowerCase() || '';
    
    if (lowerName.includes('whatsaap')) {
        return {
            icon: <Phone className="h-3.5 w-3.5 text-muted-foreground" />,
            label: "Número de teléfono",
            placeholder: "Ej: +52 1234567890",
            type: "tel",
            inputMode: "tel" as const
        };
    }  
    return {
        icon: <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />,
        label: "URL",
        placeholder: "https://ejemplo.com/pagina",
        type: "url",
        inputMode: "url" as const
    };
};