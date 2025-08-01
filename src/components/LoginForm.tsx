import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useLogin() 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64 mx-auto mt-20">
      <input
        type="text"
        placeholder="아이디"
        className="border p-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isPending} className="bg-blue-500 text-white p-2">
        {isPending ? '로그인 중...' : '로그인'}
      </button>
      {error && <p className="text-red-500 text-sm">로그인 실패</p>}
    </form>
  )
}

export default LoginForm
