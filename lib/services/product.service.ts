import {prisma} from "@/lib/prisma";

/* CREATE PRODUCT */
export const createProduct = async (data: any) => {
  return prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      stock: data.stock,
      sellerId: data.sellerId,
      categoryId: data.categoryId
    }
  });
};

/* GET APPROVED PRODUCTS */
export const getApprovedProducts = async () => {
  return prisma.product.findMany({
    where: {
      status: "APPROVED"
    },
    include: {
      seller: true,
      category: true
    }
  });
};

/* APPROVE PRODUCT */
export const approveProduct = async (productId: string) => {
  return prisma.product.update({
    where: { id: productId },
    data: { status: "APPROVED" }
  });
};

/* UPDATE PRODUCT */
export const updateProduct = async (productId: string, data: any) => {
  return prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      stock: data.stock,
      categoryId: data.categoryId
    }
  });
};

/* DELETE PRODUCT */
export const deleteProduct = async (productId: string) => {
  return prisma.product.delete({
    where: { id: productId }
  });
};