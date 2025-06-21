import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BreadcrumbTrail = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Access product info from Redux
  const productInfo = useSelector((state) => state.product.ProductInfo);
  const categories = useSelector((state) => state.category.categories);
  const resolveCategoryName = (id) => {
    const category = categories?.find((cat) => cat._id === id);
    return category ? category.name : id;
  };
  return (
    <div className="border border-[var(--neutral-200)] border-x-0 w-full flex mx-auto p-4 text-[var(--neutral-500)]">
      <ul className="flex gap-2 text-[0.875rem]">
        <li>
          <Link to="/">Home</Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          const isProductPage = pathnames[0] === "product" && index === 1;
          const isCategoryPage = pathnames[0] === "category" && index === 1;
          let displayName = name;

          if (isProductPage && productInfo?.name) {
            displayName = productInfo.name;
          } else if (isCategoryPage) {
            displayName = resolveCategoryName(name);
          }

          return (
            <React.Fragment key={routeTo}>
              <span className="mx-2">&gt;</span>
              <li>
                {isLast ? (
                  <span className="text-[var(--neutral-700)]">
                    {displayName}
                  </span>
                ) : (
                  <Link to={routeTo}>{displayName}</Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default BreadcrumbTrail;
