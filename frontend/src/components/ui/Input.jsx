const Input = ({ label, type, name, value, onChange, placeholder, error }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-400 mb-2 text-sm">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 rounded-lg bg-navy-dark border ${
          error ? "border-red-500" : "border-gray-700"
        } text-white focus:outline-none focus:border-gold transition`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
