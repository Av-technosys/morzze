import { setUserCartItemQuantity } from "@/helper/cart/action"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await setUserCartItemQuantity({
      productId: body.productId,
      productVarientBox: body.productVarientBox ?? null,
      selectedSize: body.selectedSize ?? null,
      quantity: body.quantity,
      isTypeSubscription: body.isTypeSubscription,
      frequencyInMonths: body.frequencyInMonths ?? null,
      clientCartItemId: body.clientCartItemId ?? null,
    })

    if (result.userIsNotLoggedIn) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      )
    }

    if (!result.success) {
      return Response.json(
        { success: false, error: result.message ?? "Failed to update cart" },
        { status: 400 },
      )
    }

    return Response.json({
      success: true,
      message: "Cart updated",
    })
  } catch (error) {
    console.error("Cart API Error:", error)

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}
