import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-64">
      <LoadingSpinner size="lg" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}