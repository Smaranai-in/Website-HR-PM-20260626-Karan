type Props = {
  text: "High" | "Medium" | "Low";
};

export default function Badge({ text }: Props) {
  const color =
    text === "High"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-600";

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${color}`}>
      {text}
    </span>
  );
}
