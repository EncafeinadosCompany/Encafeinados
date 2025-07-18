
import toast from "react-hot-toast"

export const CardSuccessToast = ({ t, name }: { t: any; name: string | null }) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-amber-100 ring-opacity-5`}
    >
      <div className="w-full p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img className="h-10 w-10 rounded-full" src="/cafeino.png" alt="" />
          </div>
          <div className="ml-3 space-y-4">
            <p className="text-xl font-medium text-gray-900 text-center">
              ¡Genial, tu pre registro {name ? `de la cafetería ${name}` : ","} está completo!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Te llegará un correo con las indicaciones a seguir para finalizar tu registro y que
              hagas parte de nuestro Club de Encafeinados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


export const showSuccessToast =( name: string | null) => {
  toast.custom((t) => < CardSuccessToast t={t} name={name} />, {
    duration: 10000,
  })
}

