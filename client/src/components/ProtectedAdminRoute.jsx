// // src/components/ProtectedAdminRoute.jsx
// import { useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";
// import { toast } from "sonner";

// const ProtectedAdminRoute = ({ children }) => {
//   const { user, isAuthenticated } = useSelector((state) => state.admin);
//   const location = useLocation();

//   if (!isAuthenticated || !user) {
//     toast.error("Admin login required");
//     return <Navigate to="/adminlogin" state={{ from: location }} replace />;
//   }

//   if (user.role !== "admin") {
//     toast.error("Access denied");
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedAdminRoute;
