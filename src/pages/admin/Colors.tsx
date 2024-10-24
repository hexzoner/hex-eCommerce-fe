import { getColors, createColor, updateColor, deleteColor } from "../../api/colors";
import Taxonomies from "./Taxonomies";

export default function Categories() {
  return (
    <Taxonomies
      createTaxonomy={createColor}
      deleteTaxonomy={deleteColor}
      updateTaxonomy={updateColor}
      getTaxonomies={getColors}
      modalName="feature_modal"
    />
  );
}