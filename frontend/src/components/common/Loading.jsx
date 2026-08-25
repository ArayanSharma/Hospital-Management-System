export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
}