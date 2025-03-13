
import { useState, useEffect } from 'react';

export type ViewMode = 'grid' | 'list';

export const useViewPreference = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedView = localStorage.getItem('viewMode') as ViewMode;
    return savedView || 'grid';
  });

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const toggleView = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return { viewMode, toggleView };
};
