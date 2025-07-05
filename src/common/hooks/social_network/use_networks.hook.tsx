
import { LinkIcon, Mail, Phone, User } from'@/common/ui/icons';

export const UseNetworkInputConfig = (networkName: string) => {
    const lowerName = networkName?.toLowerCase() || '';
    
    if (lowerName.includes('whatsapp')) {
        return {
            icon: <Phone className="h-3.5 w-3.5 text-muted-foreground" />,
            label: "Número de teléfono",
            placeholder: "Ej: +52 1234567890",
            type: "tel",
            inputMode: "tel" as const,
            slogan: "¡Escribenos por WhatsApp!"
        };
    }
    else if (lowerName.includes('email')){
        return {
            icon: <Mail className="h-3.5 w-3.5 text-muted-foreground" />,
            label: "Correo electrónico", 
            placeholder: "Ej: encafeinados@example.com",
            type: "email",
            inputMode: "email" as const,
            slogan: "¡Escribenos por correo electrónico!"
        }

    }
    else if(lowerName.includes('tiktok')){
        return {
            icon: <User className="h-3.5 w-3.5 text-muted-foreground" />,
            label: "Cuenta de usuario",
            placeholder: "Ej: encafeinados",
            type: "text",
            inputMode: "text" as const,
            slogan:"¡Siguenos en TikTok!"
        }
    }
    else {
        return {
            icon: <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />,
            label: "Agrega la URL de tu perfil",
            placeholder: "https://ejemplo.com/pagina",
            type: "url",
            inputMode: "url" as const,
            slogan: "¡Siguenos en...!"
        };
    }
};