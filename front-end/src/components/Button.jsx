export default function Button({
  btnName,
  isSubmitting,
  onClick,
  type = "submit",
}) {
  return (
    <>
      <button
        className="bg-[#2EB0BC] px-2 py-1 w-full mx-auto rounded-md hover:bg-teal-600 mb-2 text-stone-50 md:w-[60%] md:ml-[20%]"
        type={type}
        onClick={onClick}
      >
        {isSubmitting ? "submitting..." : btnName}
      </button>
    </>
  );
}
