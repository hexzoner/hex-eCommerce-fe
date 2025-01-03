import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from "../../api/material";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      taxonomyName="Material"
      createTaxonomy={createMaterial}
      deleteTaxonomy={deleteMaterial}
      updateTaxonomy={updateMaterial}
      getTaxonomies={getMaterials}
      modalName="material_modal"
    />
  );
}
