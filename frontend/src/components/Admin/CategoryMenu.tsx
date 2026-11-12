import { NavLink } from "react-router-dom";
import type { Category } from "../../types/category";

const categories: Category[] = ["Overview", "Shifts", "Manage"];
function CategoryMenu() {
  return (
    <div className="flex flex-row  px-3 sm:gap-4 sm:px-6 py-4 border-b border-borderDividers overflow-x-auto text-xs sm:text-sm items-center justify-center md:justify-start">
      {categories.map((category) => (
        <NavLink
          to={category.toLowerCase()}
          key={category.toLowerCase()}
          className={({ isActive }) =>
            `px-2 pb-1  ${
              isActive
                ? "border-b-2 border-primary text-primaryText"
                : "border-cardBG text-secondaryText hover:border-primary hover:text-primaryText"
            }`
          }
        >
          {category}
        </NavLink>
      ))}
    </div>
  );
}

export default CategoryMenu;
