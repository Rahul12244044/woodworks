export default function Button({ 
  children, 
  variant = 'primary', 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-primary-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100 disabled:text-gray-400',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-primary-300 disabled:text-primary-300'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}