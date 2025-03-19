
export const LabelText = ({children}:React.ComponentProps<"label">)=>{
    return (
    <label className="text-sm font-medium text-foreground">{children}</label>
    )
}