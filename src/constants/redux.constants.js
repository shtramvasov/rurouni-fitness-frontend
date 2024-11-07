export const LOADING_STATUS = {
  IDLE:         'IDLE',
  LOADING:      'LOADING',
  SUCCESS:      'SUCCESS',
  FAILED:       'FAILED'
};

// Функции проверки текущего статуса
export const isLoading    = (status) => status === LOADING_STATUS.LOADING
export const isLoaded     = (status) => status !== LOADING_STATUS.LOADING || status !== LOADING_STATUS.FAILED
export const isSuccess    = (status) => status === LOADING_STATUS.SUCCESS
export const isFailed     = (status) => status === LOADING_STATUS.FAILED

// Пагинация
export const PAGINATION = {
  DEFAULT_LIMIT:  50,
  DEFAULT_OFFSET: 0
}