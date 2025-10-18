export const categoryThemes = {
  motivacional: {
    gradient: 'from-orange-500/10 via-transparent to-red-500/10',
    icon: '🔥',
    color: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-red-500/5',
  },
  reflexiva: {
    gradient: 'from-purple-500/10 via-transparent to-blue-500/10',
    icon: '🧘',
    color: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
    bgGradient: 'bg-gradient-to-br from-purple-500/5 to-blue-500/5',
  },
  biblica: {
    gradient: 'from-amber-500/10 via-transparent to-yellow-500/10',
    icon: '✨',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
    bgGradient: 'bg-gradient-to-br from-amber-500/5 to-yellow-500/5',
  },
  autor: {
    gradient: 'from-teal-500/10 via-transparent to-cyan-500/10',
    icon: '📚',
    color: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/20',
    bgGradient: 'bg-gradient-to-br from-teal-500/5 to-cyan-500/5',
  },
  amor: {
    gradient: 'from-pink-500/10 via-transparent to-rose-500/10',
    icon: '💕',
    color: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/20',
    bgGradient: 'bg-gradient-to-br from-pink-500/5 to-rose-500/5',
  },
  'motivacao-reversa': {
    gradient: 'from-red-500/10 via-transparent to-gray-500/10',
    icon: '💥',
    color: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/20',
    bgGradient: 'bg-gradient-to-br from-red-500/5 to-gray-500/5',
  },
  aleatoria: {
    gradient: 'from-blue-500/10 via-transparent to-cyan-500/10',
    icon: '🎲',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
    bgGradient: 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5',
  },
  motivacao: {
    gradient: 'from-orange-500/10 via-transparent to-red-500/10',
    icon: '⚡',
    color: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
    bgGradient: 'bg-gradient-to-br from-orange-500/5 to-red-500/5',
  },
  inspiracao: {
    gradient: 'from-indigo-500/10 via-transparent to-purple-500/10',
    icon: '🌟',
    color: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/20',
    bgGradient: 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5',
  },
  sabedoria: {
    gradient: 'from-emerald-500/10 via-transparent to-teal-500/10',
    icon: '🦉',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5',
  },
} as const;

export type CategoryKey = keyof typeof categoryThemes;
