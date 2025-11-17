"use client";

export default function DynamicViewModal({
  isOpen,
  onClose,
  title,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data?: Record<string, any> | null;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <div className="p-5 space-y-2 max-h-[70vh] overflow-auto">
          {data ? (
            Object.entries(data).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b py-1">
                <span className="font-medium">{k}</span>
                <span className="text-gray-700 text-right">{v}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
