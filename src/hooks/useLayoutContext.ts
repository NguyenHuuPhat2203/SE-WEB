import { useOutletContext } from 'react-router-dom';
import type { User } from '../contexts/AuthContext';

export type Language = 'en' | 'vi';

interface LayoutContext {
  language: Language;
  user: User;
}

export function useLayoutContext() {
  return useOutletContext<LayoutContext>();
}
