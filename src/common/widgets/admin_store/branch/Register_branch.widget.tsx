import { useRegisterBrandMutation } from "@/api/mutations/branches/branches.mutation";
import { useRegisterCriteriaMutation } from "@/api/mutations/criteria/criteria.mutation";
import { useCriteria } from "@/api/queries/criteria/criteria.query";
import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query";
import RegisterBranch from "@/common/molecules/admin_stores/branches/register_branch.molecule";
import { Button } from "@/common/ui/button";
import { RegisterBranchFlatSchemaType, RegisterStoreBrancheSchemaFlat } from "@/common/utils/schemas/admin_stores/register_branch.schema";
import { RegisterStoreBrancheSchema,  } from "@/common/utils/schemas/auth/register_store_branche.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

 export default function RegisterBranchWidget (){

  const [direction, setDirection] = useState(0);
  const [baseAddress, setBaseAddress] = useState("");


  const navigate = useNavigate();
  const { data: socialNetworks } = useSocialNetworksQuery();
  const { data: criteria } = useCriteria();

    const registerBranchMutation = useRegisterBrandMutation();
  const registerCriteriaMutation = useRegisterCriteriaMutation();

  const name = localStorage.getItem("store");
  const tel = localStorage.getItem("tel");
  const methods = useForm<RegisterBranchFlatSchemaType>({
    resolver: zodResolver(RegisterStoreBrancheSchemaFlat),
    defaultValues: {
      name: name ? name : "",
      phone_number: tel ? tel : "",

      criteria: {},

      address: "",
      latitude: 0,
      longitude: 0,
      addressDetails: "",
      nearbyReference: null,
      additionalNotes: null,
      social_networks: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (
      criteria &&
      Object.keys(methods.getValues("criteria") || {}).length === 0
    ) {
      methods.setValue(
        "criteria",
        criteria.reduce((acc, c) => {
          acc[String(c.id)] = {
            response_text: "",
            image_url: undefined,
          };
          return acc;
        }, {} as Record<string, { response_text: string; image_url?: string; other_text?: string }>)
      );
    }
  }, [criteria, methods]);

  const onSubmit = async (data: any) => {
  


    try {
    //   if (!storeId) {
    //     toast.error("No cuenta con el id de la tienda");
    //     return;
    //   }

      const detailsParts = [];
      if (data.addressDetails)
        detailsParts.push(`Detalles: ${data.addressDetails}`);
      if (data.nearbyReference)
        detailsParts.push(`Referencia cercana: ${data.nearbyReference}`);
      if (data.additionalNotes)
        detailsParts.push(`Notas adicionales: ${data.additionalNotes}`);
      const details = detailsParts.join(" | ");

      const submitData = {
        store_id: 1,
        name: data.name,
        phone_number: data.phone_number,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        social_branches: data.social_networks || [],
        criteria: data.criteria,
        details,
      };

    //   const branchResponse = await registerBranchMutation.mutateAsync(
    //     submitData
    //   );

    //   await registerCriteriaMutation.mutateAsync({
    //     branchId: branchResponse.branch.id,
    //     criteriaResponseData: data.criteria,
    //   });

      console.log(data, "datoss")

      methods.reset();
      const name = localStorage.getItem("nameStore");
    //   showSuccessToast(name);

      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      console.error("Error during submission:", err);
      // El error ya se maneja en la mutación
    }
  };


  const onLocationSelect = (lat: number, lng: number, address: string) => {
    methods.setValue("latitude", lat, { shouldValidate: true });
    methods.setValue("longitude", lng, { shouldValidate: true });
    methods.setValue("address", address, { shouldValidate: true });
    setBaseAddress(address);
  };

    return (
       <div className="relative h-full flex-col content-center p-2 ">
        <Button onClick={()=> navigate("/stores")} className="absolute top-1 border-none shadow-none">
            <ArrowLeft/>
            Volver</Button>
         <RegisterBranch
        onLocationSelect={onLocationSelect}
        methods={methods}
        onSubmit={onSubmit}
        baseAddress={baseAddress}
        criteria={criteria || []}
        socialNetworks={socialNetworks}
        isPending={registerBranchMutation.isPending}
        ></RegisterBranch>
       </div>
    )
 }