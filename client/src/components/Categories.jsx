import fashionpng from "../assets/Categories/fashion.webp";
import electronicspng from "../assets/Categories/electronics.webp";
import Furniturepng from "../assets/Categories/furniture.webp";
import grocerypng from "../assets/Categories/grocery.webp";
import appliancepng from "../assets/Categories/appliance.webp";
import cosmmeticspng from "../assets/Categories/cosmetics.webp";
import { useDispatch } from "react-redux";
import { fetchProductsByCategory } from "../Features/Product/productSlice";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (categoryId) => {
    dispatch(fetchProductsByCategory(categoryId));
    navigate(`/category/${categoryId}`);
  };

  const categories = [
    {
      id: "684d02ce88b46b39fb4fc00a",
      name: "Fashion",
      icon: fashionpng,
    },
    {
      id: "684d02ce88b46b39fb4fc009",
      name: "Electronics",
      icon: electronicspng,
    },
    {
      id: "684d02ce88b46b39fb4fc00b",
      name: "Furnitures",
      icon: Furniturepng,
    },
    {
      id: "684d02ce88b46b39fb4fc00c",
      name: "Grocery",
      icon: grocerypng,
    },
    {
      id: "684d02ce88b46b39fb4fc00d",
      name: "Appliances",
      icon: appliancepng,
    },
    {
      id: "684d02ce88b46b39fb4fc00e",
      name: "Cosmetics",
      icon: cosmmeticspng,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-[var(--neutral-700)] dark:text-[var(--neutral-700)] mb-8 ">
        Popular Categories
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="
              flex flex-col items-center 
              hover:translate-y-[-8px] active:scale-110 duration-400
              hover:text-[var(--primary)]
              border-0 sm:border-[1px]
              border-[var(--neutral-200)] 
              hover:border-[var(--primary)] dark:hover:border-[var(--primary-light)]
              w-full h-[140px] transition-all
              bg-[var(--neutral-50)] 
              text-[var(--neutral-700)] dark:text-[var(--neutral-500)] dark:bg-neutral-800
            "
          >
            <img
              className="object-fill rounded-sm w-24 h-24 hover:scale-120 transition-all duration-300"
              src={category.icon}
              alt={category.name}
            />
            <p className="text-center font-medium">{category.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
