import type { ModuleProgress, ModuleStatus } from '../types';

const STORAGE_KEY = 'devtrack-progress';

export function getInitialProgress(): ModuleProgress[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Invalid JSON, start fresh
    }
  }

  // Initialize with first module unlocked
  return Array.from({ length: 19 }, (_, i) => ({
    moduleId: i + 1,
    status: i === 0 ? 'in-progress' : 'locked',
    completedAt: null,
    notes: '',
    completedLessons: [],
    completedActivities: []
  }));
}

export function saveProgress(progress: ModuleProgress[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateModuleStatus(
  progress: ModuleProgress[],
  moduleId: number,
  status: ModuleStatus,
  notes?: string
): ModuleProgress[] {
  const newProgress = progress.map(p => {
    if (p.moduleId === moduleId) {
      return {
        ...p,
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : p.completedAt,
        notes: notes !== undefined ? notes : p.notes
      };
    }
    return p;
  });

  // Unlock next module when current is completed
  if (status === 'completed') {
    const nextModule = newProgress.find(p => p.moduleId === moduleId + 1);
    if (nextModule && nextModule.status === 'locked') {
      nextModule.status = 'in-progress';
    }
  }

  return newProgress;
}

export function exportProgress(): string {
  const progress = localStorage.getItem(STORAGE_KEY);
  return progress || '[]';
}

export function importProgress(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
