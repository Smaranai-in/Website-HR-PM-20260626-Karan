type RightCardProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function RightCard({ title, children, footer }: RightCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-figma">
      <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">
        {title}
      </h3>

      <div className="space-y-4">{children}</div>

      {footer && (
        <div className="mt-5 flex justify-center">
          {footer}
        </div>
      )}
    </div>
  );
}
