// src/hooks/useAlert.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const useAlert = (navigate) => {
  const showAlert = (title) => {
    return MySwal.fire({
      title,
      showCancelButton: true,
      confirmButtonText: "Play Again",
      cancelButtonText: "Give Up",
      allowOutsideClick: false,
      customClass: {
        confirmButton: "bg-[#ee5151] hover:bg-[#ef4545] text-white px-3 py-2 mr-2 rounded-md hover:ring-2 hover:ring-slate-300 focus:ring-2 focus:ring-[#ef4545]", // Replace 'bg-header-color' with the actual class or color used in your header
        cancelButton: "bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 ml-2 rounded-md hover:ring-2 hover:ring-gray-200 focus:ring-2 focus:ring-gray-200", // Ensure the cancel button also has the same style
      },
      buttonsStyling: false, // Disable default SweetAlert2 button styling
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/");
        return false;
      }
    });
  };

  return showAlert;
};

export default useAlert;
