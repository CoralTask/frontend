import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-center text-lg font-semibold mb-6">로그인</h2>

        {/* 아이디 입력 */}
        <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
          <FaUser className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="아이디 또는 이메일을 입력해주세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
          <FaLock className="text-gray-400 mr-2" />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* 상태 유지 + 아이디/비번 찾기 */}
        <div className="w-[600px] flex items-center justify-between text-sm text-gray-500 mb-28">
          <label className="flex items-center gap-2">
            <span className="relative inline-flex items-center">
              <input
                type="checkbox"
                className="peer appearance-none w-6 h-6 border-2 border-primary-300 rounded-md
                   checked:bg-primary-300 checked:border-primary-300 transition"
              />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </span>
            로그인 상태 유지하기
          </label>

          <a href="#" className="hover:underline">
            아이디 / 비밀번호 찾기
          </a>
        </div>

        {/* 로그인 버튼 */}
        <button
          className={`w-[600px] h-14 rounded-md font-semibold text-sm transition ${
            isFormValid
              ? "bg-primary-300 text-white hover:bg-primary-400"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          로그인하기
        </button>

        {/* 회원가입 */}
        <p className="mt-4 text-center text-sm text-gray-500">
          아직 회원이 아니신가요?{" "}
          <a href="#" className="text-primary-300 hover:underline">
            회원가입하기
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
