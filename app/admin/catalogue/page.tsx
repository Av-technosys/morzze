import React from "react";
import { Button } from "@/components/ui/button";
import Link from "@/hooks/appLink"
import { BookOpen, Pencil, PlusCircle } from "lucide-react";
import { getCatalogue as getAllCatalogue } from "@/helper/catalogue/action";
import { CatalogueDeleteButton } from "@/components/admin/CatalogueDeleteButton";
import { Metadata } from "next";




export const metadata: Metadata = {
  title: `Morzze Catalogue | Premium Kitchen & Bathroom Solutions`,
  description: `Explore Morzze's comprehensive catalogue featuring high-quality kitchen and bathroom products, including faucets, Sinks, and other accessories.`,
}



export default async function AdminCataloguePage() {
  const allCatalogue = await getAllCatalogue();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#2D5A5D]" /> Manage Catalogue
        </h1>
        <Link href="/admin/catalogue/new">
          <Button >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Catalogue
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {allCatalogue.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400">
            No catalogue found. Add your first catalogue!
          </div>
        ) : (
          allCatalogue.map((catalogue) => (
            <div
              key={catalogue.id}
              className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold text-lg">{catalogue.title}</h3>

                <p className="text-sm text-gray-500">
                  {catalogue.category || "No Category"}
                </p>

                <p className="text-sm text-gray-400">
                  {catalogue.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/catalogue/edit/${catalogue.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-amber-200 hover:bg-amber-50 text-amber-600"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <CatalogueDeleteButton id={catalogue.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}