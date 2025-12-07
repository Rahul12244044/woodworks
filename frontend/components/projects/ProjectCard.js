import Link from 'next/link';
import Image from 'next/image';

export default function ProjectCard({ project }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Image Section - Fixed at top */}
      <Link href={`/projects/${project._id}`} className="block flex-shrink-0">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative cursor-pointer">
          {project.images?.[0] ? (
            <Image
              src={project.images[0].url}
              alt={project.images[0].alt}
              width={400}
              height={225}
              className="object-cover w-full h-48"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-600 text-4xl">🔨</span>
            </div>
          )}
          {project.featured && (
            <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      {/* Content Section - Grows to fill space */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta info at top */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{project.estimatedTime}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500 capitalize">{project.category}</span>
        </div>

        {/* Title and description */}
        <Link href={`/projects/${project._id}`}>
          <h3 className="font-semibold text-xl mb-2 hover:text-primary-600 transition-colors line-clamp-2 cursor-pointer">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {project.description}
        </p>
        
        {/* Author and CTA - Always at bottom */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-sm text-gray-500">
            By {project.author}
          </div>
          <Link 
            href={`/projects/${project._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Project →
          </Link>
        </div>
      </div>
    </div>
  );
}