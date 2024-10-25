// import { Product } from "./admin-area/Products";
// import { getCategories } from "../api/categories";
import { useState, useRef, useEffect } from "react";
import { useShop } from "../context";
// import { getProducts } from "../api/products";

export default function Filters({
  setSelectedCategories,
  setSelectedColors,
  selectedCategories,
  selectedColors,
  selectedSizes,
  setSelectedSizes,
  selectedStyles,
  setSelectedStyles,
  selectedShapes,
  setSelectedShapes,
  selectedMaterials,
  setSelectedMaterials,
  selectedTechniques,
  setSelectedTechniques,
  selectedFeatures,
  setSelectedFeatures,
  selectedRooms,
  setSelectedRooms,
  refreshSelected,
  setRefreshSelected,
}: {
  setProducts: any;
  setSelectedCategories: any;
  setSelectedColors: any;
  selectedCategories: any[];
  selectedColors: any[];
  selectedSizes: any[];
  setSelectedSizes: any;
  selectedStyles: any[];
  setSelectedStyles: any;
  selectedShapes: any[];
  setSelectedShapes: any;
  selectedMaterials: any[];
  setSelectedMaterials: any;
  selectedTechniques: any[];
  setSelectedTechniques: any;
  selectedFeatures: any[];
  setSelectedFeatures: any;
  selectedRooms: any[];
  setSelectedRooms: any;
  refreshSelected: any;
  setRefreshSelected: any;
}) {
  const { categories, colors, sizes, styles, shapes, materials, techniques, features, rooms } = useShop();
  // const [selectedRemoved, setSelectedRemoved] = useState(false);

  return (
    <div>
      <div className="border-b-[1.5px] border-t-[1.5px] border-black flex flex-wrap items-start mb-2 gap-4 py-4">
        <FilterDropdown
          name="Category"
          options={categories}
          setSelected={setSelectedCategories}
          selected={selectedCategories}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Color"
          options={colors}
          setSelected={setSelectedColors}
          selected={selectedColors}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Size"
          options={sizes}
          setSelected={setSelectedSizes}
          selected={selectedSizes}
          selectedRemoved={refreshSelected}
          width={3}
        />
        <FilterDropdown
          name="Technique"
          options={techniques}
          setSelected={setSelectedTechniques}
          selected={selectedTechniques}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Style"
          options={styles}
          setSelected={setSelectedStyles}
          selected={selectedStyles}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Material"
          options={materials}
          setSelected={setSelectedMaterials}
          selected={selectedMaterials}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Shape"
          options={shapes}
          setSelected={setSelectedShapes}
          selected={selectedShapes}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Features"
          options={features}
          setSelected={setSelectedFeatures}
          selected={selectedFeatures}
          selectedRemoved={refreshSelected}
          width={2}
        />
        <FilterDropdown
          name="Rooms"
          options={rooms}
          setSelected={setSelectedRooms}
          selected={selectedRooms}
          selectedRemoved={refreshSelected}
          width={2}
        />
      </div>
      {/* Selected categories tags for the selected filters. */}
      {selectedCategories.map((x, index) => (
        <SelectedTag
          key={index}
          obj={x}
          setSelected={setSelectedCategories}
          setSelectedRemoved={setRefreshSelected}
          selectedRemoved={refreshSelected}
        />
      ))}
      {/* Selected color tags for the selected filters. */}
      {selectedColors.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedColors} selectedRemoved={refreshSelected} setSelectedRemoved={setRefreshSelected} />
      ))}

      {selectedSizes.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedSizes} selectedRemoved={refreshSelected} setSelectedRemoved={setRefreshSelected} />
      ))}

      {selectedTechniques.map((x, index) => (
        <SelectedTag
          key={index}
          obj={x}
          setSelected={setSelectedTechniques}
          selectedRemoved={refreshSelected}
          setSelectedRemoved={setRefreshSelected}
        />
      ))}

      {selectedStyles.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedStyles} selectedRemoved={refreshSelected} setSelectedRemoved={setRefreshSelected} />
      ))}

      {selectedMaterials.map((x, index) => (
        <SelectedTag
          key={index}
          obj={x}
          setSelected={setSelectedMaterials}
          selectedRemoved={refreshSelected}
          setSelectedRemoved={setRefreshSelected}
        />
      ))}

      {selectedShapes.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedShapes} selectedRemoved={refreshSelected} setSelectedRemoved={setRefreshSelected} />
      ))}

      {selectedFeatures.map((x, index) => (
        <SelectedTag
          key={index}
          obj={x}
          setSelected={setSelectedFeatures}
          selectedRemoved={refreshSelected}
          setSelectedRemoved={setRefreshSelected}
        />
      ))}

      {selectedRooms.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedRooms} selectedRemoved={refreshSelected} setSelectedRemoved={setRefreshSelected} />
      ))}
    </div>
  );
}

// Selected tag component for the selected filters.
function SelectedTag({
  obj,
  setSelected,
  setSelectedRemoved,
  selectedRemoved,
}: {
  obj: any;
  setSelected: any;
  setSelectedRemoved: any;
  selectedRemoved: any;
}) {
  function handleRemove() {
    setSelectedRemoved(!selectedRemoved);
    setSelected((prev: any) => {
      return prev.filter((x: any) => x.id != obj.id);
    });
  }

  return (
    <div className="badge badge-primary m-1 px-2 py-4 gap-2">
      <span>{obj.name}</span>
      <span onClick={handleRemove} className="cursor-pointer">
        ✕
      </span>
    </div>
  );
}

// Dropdown component for the filters with checkboxes.
export function FilterDropdown({
  name,
  options,
  setSelected,
  selected,
  selectedRemoved,
  width,
}: {
  name: string;
  options: any[];
  setSelected: any;
  selected: any[];
  selectedRemoved?: any;
  width?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Remove focus from the dropdown when the mouse leaves.
    if (dropdownRef.current) {
      const activeElement = document.activeElement as HTMLElement;
      if (dropdownRef.current.contains(activeElement)) {
        activeElement.blur();
      }
    }
  };

  if (!width) width = 0;
  let filterMarkup = "w-full";

  if (width === 1) filterMarkup = "w-48";
  else if (width === 2) filterMarkup = "w-[25rem]";
  else if (width === 3) filterMarkup = "w-[40rem]";

  return (
    <div
      className={`dropdown  ${isHovered ? "dropdown-open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}>
      <div tabIndex={0} role="button" className="border-[1.5px] select-bordered w-full pl-6 br-8 select select-sm rounded-none">
        {name}
      </div>
      <ul tabIndex={0} className={`dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow max-h-72 ` + filterMarkup}>
        {options.map((option) => {
          return (
            <li key={option.id}>
              <MultiSelectLine id={option.id} name={option.name} setSelected={setSelected} selected={selected} selectedRemoved={selectedRemoved} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Checkbox component for the filters used in the dropdown.
function MultiSelectLine({
  name,
  setSelected,
  id,
  selected,
  selectedRemoved,
}: {
  name: string;
  setSelected: any;
  id: number;
  selected: any[];
  selectedRemoved: any;
}) {
  const [checked, setChecked] = useState(false);

  // Check each time the selected filter removed outside of the dropdown and uncheck if needed.
  useEffect(() => {
    // console.log(id);
    if (selected.find((x) => x.id === id)) setChecked(true);
    else setChecked(false);
  }, [selectedRemoved]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    processCheck(e.target.checked);
  }

  function processCheck(checked: boolean) {
    if (checked) {
      setSelected((prev: any) => [...prev, { id, name }]);
      setChecked(true);
    } else {
      setSelected((prev: any) => prev.filter((item: any) => item.id !== id));
      setChecked(false);
    }
  }

  return (
    <div className="rounded-none ">
      <label className="max-w-72 flex items-center cursor-pointer">
        <input onChange={handleChange} checked={checked} type="checkbox" className="checkbox rounded-none bg-base-300 checkbox-xs" />
        <div className="text-sm text-left w-full ml-2">{name}</div>
      </label>
    </div>
  );
}
