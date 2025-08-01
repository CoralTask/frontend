import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

const mockLoginAPI = (username: string, password: string) =>
  new Promise<{ username: string }>((resolve, reject) => {
    setTimeout(() => {
      if (username === 'test' && password === '1234') resolve({ username })
      else reject(new Error('Invalid credentials'))
    }, 1000)
  })

export const useLogin = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      mockLoginAPI(username, password),
    onSuccess: (data) => {
      dispatch(login(data))
    },
  })
}
