import { getRooms, createRoom, deleteRoom, updateRoom } from "../../api/rooms";
import Taxonomies from "./Taxonomies";

export default function Features() {
  return (
    <Taxonomies
      taxonomyName="Room"
      createTaxonomy={createRoom}
      deleteTaxonomy={deleteRoom}
      updateTaxonomy={updateRoom}
      getTaxonomies={getRooms}
      modalName="room_modal"
    />
  );
}
