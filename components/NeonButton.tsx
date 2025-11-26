import React from 'react';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 font-bold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg border-2";
  
  const variants = {
    // Gold/Luxury style
    primary: "bg-amber-500 border-amber-600 text-white hover:bg-amber-400 hover:shadow-amber-500/50 rounded-sm",
    // Dark Mafia style
    secondary: "bg-slate-900 border-slate-800 text-amber-500 hover:bg-slate-800 hover:text-amber-400 hover:shadow-slate-900/50 rounded-sm",
    // Danger
    danger: "bg-red-700 border-red-800 text-white hover:bg-red-600 hover:shadow-red-700/50 rounded-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      <span className="font-mafia tracking-widest">{children}</span>
    </button>
  );
};

export default NeonButton;