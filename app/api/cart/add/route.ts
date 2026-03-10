import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, productId, quantity } = await req.json();

    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (existingItem) {

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedItem
      });

    } else {

      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });

      return NextResponse.json({
        success: true,
        data: newItem
      });
    }

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Add to cart failed"
    });
  }
}