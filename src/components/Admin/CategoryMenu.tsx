import { NavLink } from "react-router-dom";
import type { Category } from "../../types/category";

const categories: Category[] = ["Overview", "Shifts", "Manage", "Earnings"];
function CategoryMenu() {
  return (
    <div className="flex flex-row  px-3 sm:gap-4 sm:px-6 py-4 border-b border-borderDividers">
      {categories.map((category) => (
        <NavLink
          to={category.toLowerCase()}
          key={category.toLowerCase()}
          className={({ isActive }) =>
            `bordr-b px-2 pb-1 ${
              isActive
                ? "border-primary text-primaryText"
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
