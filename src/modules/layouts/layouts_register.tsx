import { LinkReturn } from "@/common/molecules/auth/LinkReturn";
import { Outlet } from "react-router-dom";

const LayoutRegister = () => {
  return (
    <div
      className="min-h-full bg-gradient-to-b from-orange-100 to-orange-200"
      translate="no"
    >
      <LinkReturn link="/cuestion" className="m-2 xl:m-4" />
      <div className="h-full p-2 flex flex-col items-center justify-center">
      <Outlet />
      </div>
    </div>
  );
};

export default LayoutRegister;
