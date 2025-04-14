import { LinkReturn } from "@/common/molecules/auth/LinkReturn"
import Formlogin from "@/common/widgets/forms/auth/formLogin"

const LoginPage = () => {

  return (
    <div className="min-h-screen bg-white  md:bg-gradient-to-b md:from-orange-50 md:to-orange-200 flex flex-col">
      {/* <LinkReturn link="/" className="m-10"></LinkReturn> */}
      <div className="flex-1 flex flex-col items-center justify-center ">
        <div className="w-full max-w-sm md:max-w-3xl mx-auto">
          <Formlogin />
        </div>
      </div>
    </div>
  )

}

export default LoginPage