export interface iRoom {
  id: number;
  name: string;
}

export const RoomTypes: iRoom[] = [
  { id: 1, name: "Living Room" },
  { id: 2, name: "Bedroom" },
  { id: 3, name: "Dining Room" },
  { id: 4, name: "Kitchen" },
  { id: 5, name: "Hallway" },
  { id: 6, name: "Balcony" },
  { id: 7, name: "Bathroom" },
];

//convert string to room object - string example "1,2,3," to object {id:1,name:"Living Room"}
export function convertStringToRooms(roomsStr: string) {
  const a = roomsStr.split(",").map((x) => {
    if (x !== "")
      return {
        id: parseInt(x),
        name: RoomTypes.find((r) => r.id === parseInt(x))?.name || "",
      };
  });

  return a.filter((x: any) => x !== undefined);
}

export function convertRoomsToString(rooms: iRoom[]) {
  return rooms.map((r) => r.id).join(",");
}
