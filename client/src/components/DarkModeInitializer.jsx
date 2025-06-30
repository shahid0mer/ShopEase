// src/components/DarkModeInitializer.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDarkMode,
  selectDarkMode,
} from "../Features/DarkMode/darkModeSlice.js";

const DarkModeInitializer = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedMode !== null) {
      dispatch(setDarkMode(savedMode === "true"));
    } else {
      dispatch(setDarkMode(isSystemDark));
    }
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
};

export default DarkModeInitializer;
