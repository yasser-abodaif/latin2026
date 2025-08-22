import { CategoryTable } from './(components)'
import { getCategories } from './category.action'

export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoryTable data={categories.data} />
}
