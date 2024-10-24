import { getFeatures, createFeature, updateFeature, deleteFeature } from "../../api/features";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      createTaxonomy={createFeature}
      deleteTaxonomy={deleteFeature}
      updateTaxonomy={updateFeature}
      getTaxonomies={getFeatures}
      modalName="feature_modal"
    />
  );
}