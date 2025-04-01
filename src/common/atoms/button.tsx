import React from "react";
import { Button } from "../ui/button";

interface ButtonDefaultProps {
    className?: string;
    variant?: string;
    size?: string;
    asChild?: boolean;
    children?: React.ReactNode;
    onClick?: () => void; 
}

export const ButtonDefault: React.FC<ButtonDefaultProps> = ({ className, variant, size, asChild = false, ...props }) => {
    return <Button className={`${className} ${variant} ${size}`} {...props}>
        {props.children}
    </Button>;
}