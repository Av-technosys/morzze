import React from "react";
import { getCoupons, deleteCoupon } from "@/helper/coupons/action";
import { Button } from "@/components/ui/button";
import Link from "@/hooks/appLink"
import { PlusCircle, TicketPercent, Pencil } from "lucide-react";
import { revalidatePath } from "next/cache";
import DeleteCouponButton from "@/components/admin/DeleteCouponButton";

async function Page() {
  const allCoupons = await getCoupons();

  async function deleteAction(id: string) {
    "use server";

    const res = await deleteCoupon(id);

    if (res.success) {
      revalidatePath("/admin/coupons");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TicketPercent className="w-6 h-6 text-[#2D5A5D]" />
          Manage Coupons
        </h1>

        <Link href="/admin/coupons/new">
          <Button >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Coupon
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {allCoupons.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400">
            No coupons found. Add your first coupon!
          </div>
        ) : (
          allCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold text-lg">{coupon.title}</h3>

                <p className="text-sm text-gray-500">{coupon.category}</p>

                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-sm text-green-600 font-medium">
                    {coupon.discountValue}% OFF
                  </span>

                  {coupon.upto && (
                    <span className="text-sm text-blue-600 font-medium">
                      Upto {coupon.upto}
                    </span>
                  )}

                  <span className="text-sm text-gray-400">
                    {coupon.couponCode}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  {coupon.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/coupons/edit/${coupon.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-amber-200 hover:bg-amber-50 text-amber-600"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <DeleteCouponButton action={deleteAction.bind(null, coupon.id)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Page;