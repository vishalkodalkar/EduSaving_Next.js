import {prisma} from "@/lib/prisma";

export async function calculateCart(userId: string) {

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!cart) {
    return { items: [], cartTotal: 0 };
  }

  let cartTotal = 0;

  const items = cart.items.map((item) => {

    const subtotal = item.product.price * item.quantity;

    cartTotal += subtotal;

    return {
      cartItemId: item.id,
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      subtotal
    };
  });

  return {
    items,
    cartTotal
  };
}