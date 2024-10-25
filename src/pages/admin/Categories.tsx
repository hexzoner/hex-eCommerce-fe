import { getCategories, deleteCategory, updateCategory, createCategory } from "../../api/categories";
import Taxonomies from "./Taxonomies";

export default function Categories() {
  return (
    <Taxonomies
      createTaxonomy={createCategory}
      deleteTaxonomy={deleteCategory}
      updateTaxonomy={updateCategory}
      getTaxonomies={getCategories}
      modalName="feature_modal"
    />
  );
}
