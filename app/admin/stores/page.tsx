import React from "react";
import { Button } from "@/components/ui/button";
import Link from "@/hooks/appLink"
import { MapPin, Pencil, PlusCircle } from "lucide-react";
import { getStores } from "@/helper/stores/action";
import { StoreDeleteButton } from "@/components/admin/StoreDeleteButton";
import { ContactLink } from "@/components/ContactLink";
import { StoreBulkUpload } from "@/components/admin/StoreBulkUpload";

export default async function AdminStoresPage() {
  const allStores = await getStores();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#2D5A5D]" /> Manage Stores
        </h1>
        <div className="flex items-center gap-2">
          {/* <StoreBulkUpload /> */}
          <Link href="/admin/stores/new">
            <Button >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Store
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4">
        {allStores.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400">
            No stores found. Add your first store!
          </div>
        ) : (
          allStores.map((store) => (
            <div
              key={store.id}
              className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">{store.storeName}</h3>
                  <span
                    className="px-2 py-[2px] rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor: store.badgeBgColor ?? "#f4e8c7",
                      color: store.badgeTextColor ?? "#9b5d00",
                    }}
                  >
                    {store.storeType}
                  </span>
                  {store.isFeatured && (
                    <span className="px-2 py-[2px] rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  {store.city}, {store.state}
                </p>

                <p className="text-sm text-gray-400">
                  {store.isActive ? "✅ Active" : "❌ Inactive"} ·{" "}
                  <ContactLink type="phone" value={store.contactNumber} />
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/stores/edit/${store.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-amber-200 hover:bg-amber-50 text-amber-600"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <StoreDeleteButton id={store.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
