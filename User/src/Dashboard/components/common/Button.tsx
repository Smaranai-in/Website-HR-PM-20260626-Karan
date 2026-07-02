type ButtonProps = {
  label: string;
};

export default function Button({ label }: ButtonProps) {
  return (
    <button className="px-4 py-1.5 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
      {label}
    </button>
  );
}
