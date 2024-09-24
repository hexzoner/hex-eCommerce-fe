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
}: {
  setProducts: any;
  setSelectedCategories: any;
  setSelectedColors: any;
  selectedCategories: any[];
  selectedColors: any[];
}) {
  const { categories, colors } = useShop();
  const [selectedRemoved, setSelectedRemoved] = useState(false);

  return (
    <div>
      <div className="border-b-[1.5px] border-t-[1.5px] border-black flex items-start mb-2">
        <FilterDropdown
          name="Category"
          options={categories}
          setSelected={setSelectedCategories}
          selected={selectedCategories}
          selectedRemoved={selectedRemoved}
        />
        <FilterDropdown name="Color" options={colors} setSelected={setSelectedColors} selected={selectedColors} selectedRemoved={selectedRemoved} />
      </div>
      {/* Selected categories tags for the selected filters. */}
      {selectedCategories.map((x, index) => (
        <SelectedTag
          key={index}
          obj={x}
          setSelected={setSelectedCategories}
          setSelectedRemoved={setSelectedRemoved}
          selectedRemoved={selectedRemoved}
        />
      ))}
      {/* Selected color tags for the selected filters. */}
      {selectedColors.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedColors} selectedRemoved={selectedRemoved} setSelectedRemoved={setSelectedRemoved} />
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
function FilterDropdown({
  name,
  options,
  setSelected,
  selected,
  selectedRemoved,
}: {
  name: string;
  options: any[];
  setSelected: any;
  selected: any[];
  selectedRemoved: any;
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

  return (
    <div className={`dropdown ${isHovered ? "dropdown-open" : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={dropdownRef}>
      <div tabIndex={0} role="button" className="btn m-1 px-8">
        {name}
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow">
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
    if (selected.find((x) => x.id === id)) setChecked(true);
    else setChecked(false);
  }, [selectedRemoved]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelected((prev: any) => [...prev, { id, name }]);
      setChecked(true);
    } else {
      setSelected((prev: any) => prev.filter((item: any) => item.id !== id));
      setChecked(false);
    }
  }

  return (
    <div className="rounded-none">
      <label className="cursor-pointer max-w-64">
        <input onChange={handleChange} checked={checked} type="checkbox" className="checkbox rounded-none bg-base-300 checkbox-xs" />
        <span className="text-sm text-left w-full ml-2">{name}</span>
      </label>
    </div>
  );
}
