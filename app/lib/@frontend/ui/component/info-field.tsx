interface InfoFieldProps {
  label: string;
  value?: string;
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="text-xs mt-3">
      <h4 className="font-semibold">{label}</h4>
      <p className="text-gray-700">{value ?? ""}</p>
    </div>
  );
}
