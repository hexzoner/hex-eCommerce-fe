import { getTechniques, createTechnique, updateTechnique, deleteTechnique } from "../../api/technique";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      createTaxonomy={createTechnique}
      deleteTaxonomy={deleteTechnique}
      updateTaxonomy={updateTechnique}
      getTaxonomies={getTechniques}
      modalName="tecnhinque_modal"
    />
  );
}
