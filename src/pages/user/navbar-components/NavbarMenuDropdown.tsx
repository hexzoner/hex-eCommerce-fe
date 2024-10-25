import { useRef, useState } from "react";
import { iTaxonomy } from "../../admin/Taxonomies";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../context";

export default function NavbarMenuDropdown({ name, options }: { name: string; options: iTaxonomy[] }) {
  const [isHovered, setIsHovered] = useState(false);
  const { setFilter } = useShop();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

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
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
      className={`dropdown dropdown-hover p-0 ${isHovered ? "dropdown-open" : ""}`}>
      <div tabIndex={0} role="button" className={`select select-ghost m-0 rounded-none items-center px-[1.75rem] hover:text-red-700 `}>
        <p className="font-semibold">{name}</p>
      </div>
      <div tabIndex={0} className="dropdown-content left-0 lg:left-[-15rem] menu bg-base-100 rounded-none z-[1] p-2 shadow ">
        <ul className="flex w-screen flex-wrap md:w-full md:flex-nowrap m-auto">
          {options.map((option, index) => (
            <li
              onClick={() => {
                setFilter({ type: name, id: option.id, value: option.name });
                nav(`/products/`);
              }}
              className="bg-base-100 h-42 w-36"
              key={index}>
              <div className="flex flex-col rounded-none">
                <img className="h-28 w-36 object-cover" src={option.image} alt="image" />
                <p className="font-semibold text-center">{option.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
