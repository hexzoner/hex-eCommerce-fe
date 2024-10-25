import { getStyles, createStyle, updateStyle, deleteStyle } from "../../api/styles";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      createTaxonomy={createStyle}
      deleteTaxonomy={deleteStyle}
      updateTaxonomy={updateStyle}
      getTaxonomies={getStyles}
      modalName="style_modal"
    />
  );
}
