const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyle =
    "w-full py-3 px-4 rounded-lg font-bold transition duration-300 cursor-pointer disabled:opacity-50";

  const variants = {
    primary: "bg-gold text-navy-dark hover:bg-gold-light", // الذهبي الفخم
    outline: "border-2 border-gold text-gold hover:bg-navy-dark", // المفرغ
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
