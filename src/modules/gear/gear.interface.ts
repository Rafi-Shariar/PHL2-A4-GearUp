import { GearItemsWhereInput } from "../../../generated/prisma/models";

export interface IGearQuery extends GearItemsWhereInput {

    searchTerm ?: string;
    limit ?: string;
    page ?: string;
    age ?: string;
    sortBy ?: string;
    sortOrder ? : string;
}