type SortOrder = "asc" | "desc";

const sortTables = <T extends Record<string, any>>(table: T[], key: string, sortOrder: SortOrder = "asc"): T[] => {
  const getNestedValue = (obj: T, key: string) => {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const sortedTable = [...table].sort((a, b) => {
    // Compare the values based on the key
    const valueA = getNestedValue(a, key);
    const valueB = getNestedValue(b, key);

    // Handle undefined values
    if (valueA === undefined || valueB === undefined) {
      return 0;
    }

    // Sorting logic based on type
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc" ? (valueA as string).localeCompare(valueB as string) : (valueB as string).localeCompare(valueA as string);
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
