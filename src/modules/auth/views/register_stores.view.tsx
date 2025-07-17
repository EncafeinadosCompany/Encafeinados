import { LinkReturn } from "@/common/molecules/auth/LinkReturn";
import FormRegisterStores from "@/common/widgets/forms/auth/form_register_stores.widget";

const RegisterStorePage = () => {
  return (
    <div
      className="min-h-full bg-gradient-to-b from-orange-100 to-orange-200"
      translate="no"
    >
      <LinkReturn link="/register" className="m-2 xl:m-4" />
      <div className="h-full p-2 flex flex-col items-center justify-center">
        <FormRegisterStores />
      </div>
    </div>
  );
};

export default RegisterStorePage;
