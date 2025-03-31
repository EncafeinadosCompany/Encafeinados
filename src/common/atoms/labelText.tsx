import React from 'react';

export const LabelText = (props: React.ComponentProps<"label">)=>{
    const { children, ...rest } = props;
    return (
    <label className="text-sm font-medium text-foreground" {...rest}>{children}</label>
    )
}