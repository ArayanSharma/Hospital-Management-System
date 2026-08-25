export default function ErrorState({ message = "Something went wrong" }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2 inline-block">
          {message}
        </p>
      </div>
    </div>
  );
}