/**
 * Listing helpers re-export the live store.
 * Inventory is empty until Brandon adds real properties in Admin → Listings.
 */
export {
  getActiveListings,
  getListingBySlug,
  getListingsByCounty,
  getListingsByMission,
  formatPrice,
  pricePerAcre,
  readListings,
  addListing,
  updateListing,
  deleteListing,
} from "@/lib/listings-store";

/** @deprecated Use readListings() — kept empty for any static import checks */
export const LISTINGS: never[] = [];
