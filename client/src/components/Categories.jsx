import fashionpng from "../assets/Categories/Fashion.png";
import electronicspng from "../assets/Categories/Electronics.png";
import Furniturepng from "../assets/Categories/Home & Furniture.png";
import grocerypng from "../assets/Categories/Grocery.png";
import appliancepng from "../assets/Categories/Appliances.png";
import cosmmeticspng from "../assets/Categories/Cosmetics.png";
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
      <h2 className="text-2xl font-bold text-[var(--neutral-700)] mb-8">Popular Categories</h2>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center p-4 hover:translate-y-[-8px] active:scale-110 duration-400 hover:text-[var(--primary)] border-0 sm:border-[1px] border-[var(--neutral-200)] hover:border-[var(--primary)] w-full h-[130px] transition-all"
          >
            <img
              className="object-contain rounded-sm w-16 h-16 mb-2"
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
