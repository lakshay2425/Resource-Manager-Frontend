import { 
  BookOpen,
  Code,
  Briefcase,
  Database,
  Wrench,
  GraduationCap,
} from 'lucide-react';

export const CategoryIcon = ({ category, className = "w-4 h-4" }) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('course') || categoryLower.includes('learn')) {
      return <BookOpen className={className} />;
    }
    if (categoryLower.includes('frontend') || categoryLower.includes('code') || categoryLower.includes('react')) {
      return <Code className={className} />;
    }
    if (categoryLower.includes('interview') || categoryLower.includes('education')) {
      return <GraduationCap className={className} />;
    }
    if (categoryLower.includes('company') || categoryLower.includes('job')) {
      return <Briefcase className={className} />;
    }
    if (categoryLower.includes('dsa') || categoryLower.includes('data')) {
      return <Database className={className} />;
    }
    if (categoryLower.includes('tool') || categoryLower.includes('ai')) {
      return <Wrench className={className} />;
    }
    
    return <BookOpen className={className} />;
  };