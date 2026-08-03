import FindStoreHero from "@/components/storeLocator/banner";
import StoreLocatorSection from "@/components/storeLocator/storestabs";
import BecomeDealerSection from "@/components/storeLocator/becomeDealer";
import { getActiveStores } from "@/helper/stores/action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Find a Morzze Store Near You – Showrooms & Dealers`,
  description: `Find Morzze stores near you – from flagship showrooms to authorised dealers across India. Experience our kitchen & bathroom collection up close before you buy.`,
  alternates: {
    canonical: "/stores",
  },
};

export default async function StoresPage() {
  const dbStores = await getActiveStores();

  // Transform DB data to shape frontend components expect
  const storesData = dbStores.map((store) => ({
    name: store.storeName,
    city: store.city,
    state: store.state,
    latitude: Number(store.latitude),
    longitude: Number(store.longitude),
    address: store.address,
    contact: store.contactNumber,
    email: store.email,
    hours: store.workingHours,
    type: store.storeType,
    badgeBgColor: store.badgeBgColor ?? "#f4e8c7",
    badgeTextColor: store.badgeTextColor ?? "#9b5d00",
    features: store.features ?? [],
    mapEmbedUrl: store.mapEmbedUrl,
  }));

  return (
    <div>
      <FindStoreHero />
      <StoreLocatorSection stores={storesData} />
      {/* <StoreTypesSection /> */}
      <BecomeDealerSection />
    </div>
  );
}
