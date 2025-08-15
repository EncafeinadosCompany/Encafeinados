import { useRegisterBrandMutation } from "@/api/mutations/branches/branches.mutation";
import { useRegisterCriteriaMutation } from "@/api/mutations/criteria/criteria.mutation";
import { useCriteria } from "@/api/queries/criteria/criteria.query";
import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query";
import RegisterBranch from "@/common/molecules/admin_stores/branches/register_branch.molecule";
import { Button } from "@/common/ui/button";
import {
  RegisterBranchFlatSchemaType,
  RegisterStoreBrancheSchemaFlat,
} from "@/common/utils/schemas/admin_stores/register_branch.schema";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterBranchWidget() {
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
      const storeId = getEncryptedItem("storeId");
      const detailsParts = [];
      if (data.addressDetails)
        detailsParts.push(`Detalles: ${data.addressDetails}`);
      if (data.nearbyReference)
        detailsParts.push(`Referencia cercana: ${data.nearbyReference}`);
      if (data.additionalNotes)
        detailsParts.push(`Notas adicionales: ${data.additionalNotes}`);
      const details = detailsParts.join(" | ");

      const submitData = {
        store_id: Number(storeId),
        name: data.name,
        phone_number: data.phone_number,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        social_branches: data.social_networks || [],
        criteria: data.criteria,
        details,
      };

      const branchResponse = await registerBranchMutation.mutateAsync(
        submitData
      );

      await registerCriteriaMutation.mutateAsync({
        branchId: branchResponse.branch.id,
        criteriaResponseData: data.criteria,
      });


    toast.success("¡Sucursal creada con éxito! Está en proceso de validación.", {
      style: {
        background: '#D4A574',
        color: '#4A2C17',
      },
      duration: 5000
    })

    setTimeout(()=>{
        navigate("/stores")
    },100)

      methods.reset();
    } catch (err) {
      console.error("Error during submission:", err);
    }
  };

  const onLocationSelect = (lat: number, lng: number, address: string) => {
    methods.setValue("latitude", lat, { shouldValidate: true });
    methods.setValue("longitude", lng, { shouldValidate: true });
    methods.setValue("address", address, { shouldValidate: true });
    setBaseAddress(address);
  };

  return (
    <div className="relative h-full flex-col content-center scrollbar-subtle overflow-y-auto p-2">
      <Button
        onClick={() => navigate("/stores")}
        className="border-none shadow-none z-10"
      >
        <ArrowLeft />
        Volver
      </Button>
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
  );
}
