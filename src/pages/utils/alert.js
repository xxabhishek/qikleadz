// src/utils/alert.js
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Basic alert
export const showAlert = (title, text, icon = "info") => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: "#0f66af",
    confirmButtonText: "OK",
  });
};

// Success alert
export const showSuccess = (title, text) => showAlert(title, text, "success");

// Error alert
export const showError = (title, text) => showAlert(title, text, "error");

// Confirmation alert
export const showConfirm = async (title, text) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0961a8ff",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });
  return result.isConfirmed;
};
