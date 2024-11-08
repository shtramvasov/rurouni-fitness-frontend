import axios from 'axios'
import toast from 'react-hot-toast';


// Инициализация клиента с общими настройками
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});


// Обработчик ошибок
apiClient.interceptors.response.use(
  response => response.data,
  error    => {
    const { message } = error.response.data
    if (message) toast.error(message)
    if(error.response.status === 401) window.location.replace('/login')
      
    return Promise.reject(message ?? error)
  }
)



export default apiClient
