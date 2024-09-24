// import { Product } from "./admin-area/Products";
// import { getCategories } from "../api/categories";
import { useState, useRef } from "react";
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

  return (
    <div>
      <div className="border-b-[1.5px] border-t-[1.5px] border-black flex items-start mb-2">
        <FilterDropdown name="Category" options={categories} setSelected={setSelectedCategories} />
        <FilterDropdown name="Color" options={colors} setSelected={setSelectedColors} />
      </div>
      {selectedCategories.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedCategories} />
      ))}

      {selectedColors.map((x, index) => (
        <SelectedTag key={index} obj={x} setSelected={setSelectedColors} />
      ))}
    </div>
  );
}

function SelectedTag({ obj, setSelected }: { obj: any; setSelected: any }) {
  function handleRemove() {
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

function FilterDropdown({ name, options, setSelected }: { name: string; options: any[]; setSelected: any }) {
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
    //   select className="select w-full max-w-xs"
    <div className={`dropdown ${isHovered ? "dropdown-open" : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={dropdownRef}>
      <div tabIndex={0} role="button" className="btn m-1 px-8">
        {name}
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow">
        {options.map((option) => {
          return (
            <li key={option.id}>
              <MultiSelectLine id={option.id} name={option.name} setSelected={setSelected} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MultiSelectLine({ name, setSelected, id }: { name: string; setSelected: any; id: number }) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) setSelected((prev: any) => [...prev, { id, name }]);
    else setSelected((prev: any) => prev.filter((item: any) => item.id !== id));
  }

  return (
    <div className="rounded-none">
      <label className="cursor-pointer max-w-64">
        <input onChange={handleChange} type="checkbox" className="checkbox rounded-none bg-base-300 checkbox-xs" />
        <span className="text-sm text-left w-full ml-2">{name}</span>
      </label>
    </div>
  );
}
