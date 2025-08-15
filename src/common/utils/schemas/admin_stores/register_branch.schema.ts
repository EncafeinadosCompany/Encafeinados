import { z } from "zod";
import { AddressDetailsSchema, BranchBasicDataSchema, MapSchema, SocialNetworksSchema } from "../branch/basic_data.schema";
import { RegisterCriteriaSchema } from "../criteria/register_criteria.schemas";

export const RegisterStoreBrancheSchemaFlat = 
  BranchBasicDataSchema
  .merge(RegisterCriteriaSchema)
  .merge(MapSchema)
  .merge(AddressDetailsSchema)
  .merge(SocialNetworksSchema)

export type RegisterBranchFlatSchemaType  = z.infer<typeof RegisterStoreBrancheSchemaFlat>;