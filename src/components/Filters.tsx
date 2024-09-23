// import { Product } from "./admin-area/Products";
// import { getCategories } from "../api/categories";
import { useState, useRef } from "react";
import { useShop } from "../context";

export default function Filters() {
  const { categories, colors } = useShop();
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedColors, setSelectedColors] = useState<any[]>([]);

  return (
    <div>
      <div className="border-b-[1.5px] border-t-[1.5px] border-black flex items-start mb-2">
        <FilterDropdown name="Category" options={categories} setSelected={setSelectedCategories} />
        <FilterDropdown name="Color" options={colors} setSelected={setSelectedColors} />
      </div>
      {selectedCategories.map((x, index) => (
        <SelectedTag key={index} name={x} setSelected={setSelectedCategories} />
      ))}

      {selectedColors.map((x, index) => (
        <SelectedTag key={index} name={x} setSelected={setSelectedColors} />
      ))}
    </div>
  );
}

function SelectedTag({ name, setSelected }: { name: string; setSelected: any }) {
  function handleRemove() {
    setSelected((prev: any) => {
      return prev.filter((x: any) => x != name);
    });
  }

  return (
    <div className="badge badge-primary m-1 px-2 py-4 gap-2">
      <span>{name}</span>
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
              <MultiSelectLine name={option.name} setSelected={setSelected} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MultiSelectLine({ name, setSelected }: { name: string; setSelected: any }) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) setSelected((prev: any) => [...prev, name]);
    else setSelected((prev: any) => prev.filter((item: any) => item !== name));
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
