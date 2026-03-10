import Category from "@/models/category.model";

export const createCategory = async (req: any) => {
  const { name, slug, description, icon } = await req.json();

  const category = await Category.create({
    name,
    slug,
    description,
    icon
  });

  return category;
};

export const getCategories = async () => {
  const categories = await Category.find({ isActive: true });
  return categories;
};