import { getStyles, createStyle, updateStyle, deleteStyle } from "../../api/styles";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      taxonomyName="Style"
      createTaxonomy={createStyle}
      deleteTaxonomy={deleteStyle}
      updateTaxonomy={updateStyle}
      getTaxonomies={getStyles}
      modalName="style_modal"
    />
  );
}
