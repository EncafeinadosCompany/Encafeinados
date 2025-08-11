import { LinkReturn } from "@/common/molecules/auth/LinkReturn";
import RegisterStoreBranches from "@/common/widgets/forms/auth/form_register_stores_branches.widget";

const RegisterStoreBranchesPage = () => {
  return (
    <div
      className="min-h-full overflow-y-auto scrollbar-subtle bg-gradient-to-b from-orange-100 to-orange-200"
      translate="no"
    >
      <LinkReturn link="/store-registration" className="m-2" />
      <div className="h-full p-2 flex flex-col items-center justify-center ">
        <RegisterStoreBranches />
      </div>
    </div>
  );
};

export default RegisterStoreBranchesPage;
