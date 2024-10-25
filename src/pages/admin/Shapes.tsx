import { getShapes, createShape, updateShape, deleteShape } from "../../api/shapes";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      taxonomyName="Shape"
      createTaxonomy={createShape}
      deleteTaxonomy={deleteShape}
      updateTaxonomy={updateShape}
      getTaxonomies={getShapes}
      modalName="shape_modal"
    />
  );
}
