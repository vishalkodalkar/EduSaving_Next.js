import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {

  try {

    const body = await req.json()

    const {
      productId,
      title,
      description,
      price,
      images,
      stock,
      categoryId
    } = body

    const product = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        title,
        description,
        price,
        images,
        stock,
        categoryId
      }
    })

    return NextResponse.json(product)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Product update failed" },
      { status: 500 }
    )

  }

}