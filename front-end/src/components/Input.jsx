export default function Input({
  label,
  placeholder,
  type,
  name,
  error,
  defaultValue,
  list, // For dropdown options
  onChange,
}) {
  // If type is dropdown, render select element
  if (type === "dropdown" || type === "select") {
    return (
      <>
        <div className="mb-2 ">
          <label
            htmlFor={name}
            className="text-[17px] py-4 mb-8  text-stone-500 "
          >
            {label}
          </label>
          <select
            onChange={onChange}
            id={name}
            name={name}
            defaultValue={defaultValue}
            className={`border px-2 py-1 rounded-md w-full mb-1 mt-2 ${
              error ? "border-red-500" : "border-[#2EB0BC]"
            }`}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {list &&
              list.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        </div>
      </>
    );
  }

  // Regular input field
  return (
    <>
      <div className="mb-2 ">
        <label
          htmlFor={name}
          className="text-[17px] py-4 mb-8  text-stone-500 "
        >
          {label}
        </label>
        <input
          type={type}
          id={name}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`border px-2 py-1 rounded-md w-full mb-1 mt-2 ${
            error ? "border-red-500" : "border-[#2EB0BC]"
          }`}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      </div>
    </>
  );
}
