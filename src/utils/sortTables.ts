type SortOrder = "asc" | "desc";

const sortTables = <T extends Record<string, any>>(table: T[], key: string, sortOrder: SortOrder = "asc"): T[] => {
  const sortedTable = [...table].sort((a, b) => {
    // Compare the values based on the key
    const valueA = a[key];
    const valueB = b[key];

    // Handle undefined values
    if (valueA === undefined || valueB === undefined) {
      return 0;
    }

    // Sorting logic based on type
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  return sortedTable;
};

export default sortTables;

export function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}
