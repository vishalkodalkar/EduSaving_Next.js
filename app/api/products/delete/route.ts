import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/services/product.service";

export async function DELETE(req: Request) {

  try {

    const { productId } = await req.json();

    const product = await deleteProduct(productId);

    return NextResponse.json(product);

  } catch (error) {

    return NextResponse.json(
      { error: "Product deletion failed" },
      { status: 500 }
    );

  }

}