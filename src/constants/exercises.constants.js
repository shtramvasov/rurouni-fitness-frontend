export const MUSCLE_GROUPS = {
  BICEPS: 'Бицепс',
  TRICEPS: 'Трицепс',
  SHOULDERS: 'Плечи',
  CHEST: 'Грудь',
  LEGS: 'Ноги',
  BACK: 'Спина',
};

export const MUSCLE_GROUPS_OPTIONS = Object.keys(MUSCLE_GROUPS).map((key) => ({
  title: MUSCLE_GROUPS[key],
  value: key.toLowerCase(),
}));