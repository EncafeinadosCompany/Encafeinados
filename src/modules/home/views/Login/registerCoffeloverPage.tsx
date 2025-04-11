import { LinkReturn } from "@/common/molecules/auth/LinkReturn"
import FormRegisterCoffeelover from "@/common/widgets/forms/auth/formRegisterCoffelovers"

const RegisterCoffeloverPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200" translate="no">
      <LinkReturn link="/register" className="m-2 xl:m-10" >
      </LinkReturn>
      <div className="h-full p-2 flex flex-col items-center justify-center  ">
      <FormRegisterCoffeelover></FormRegisterCoffeelover>
      </div>

    </div>
  )
}

export default RegisterCoffeloverPage