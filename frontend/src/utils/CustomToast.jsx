import toast from "react-hot-toast";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

// Custom toast styles and icons
const toastStyles = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};

const toastIcons = {
  success: CheckCircle,
  error: X,
  warning: AlertTriangle,
  info: Info,
};

export const CustomToast = (message, options = {}) => {
  const { type = "info", duration = 4000, ...restOptions } = options;

  const Icon = toastIcons[type];

  return toast.custom(
    (t) => (
      <div
        className={`
        ${toastStyles[type]} 
        flex items-center 
        px-4 py-2 
        rounded-lg 
        shadow-lg 
        transform 
        transition-all 
        duration-300 
        ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
      `}
      >
        {Icon && <Icon className="mr-2" size={20} />}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 transition-opacity hover:opacity-75"
        >
          <X size={16} />
        </button>
      </div>
    ),
    {
      duration,
      position: "bottom-right",
      ...restOptions,
    }
  );
};

export default CustomToast;
