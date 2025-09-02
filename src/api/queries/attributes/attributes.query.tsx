import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import {
  Attribute,
  AttributeByID,
  Attributes,
} from "@/api/types/attributes/attributes.type";
import { defaultRetryConfig, isValidId } from "../Config/Config.Query";

const authClient = new AuthClient();

export const useAttributes = () => {
  return useQuery<Attribute[]>({
    queryKey: ["attributes"],
    queryFn: async () => {
      const response = await authClient.get<Attributes>("/attributes");
      return response.attributes;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBranchAttributes = (id: string) => {
  return useQuery<AttributeByID, Error>({
    queryKey: ["branch-attributes", id],
    queryFn: async (): Promise<AttributeByID> => {
      const response = await authClient.get<AttributeByID>(
        `/branch-attributes/${id}`
      );
      return response;
    },
    enabled: isValidId(id),

    ...defaultRetryConfig,
  });
};
