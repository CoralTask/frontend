  import { useState } from "react";
  import { FaUser, FaLock } from "react-icons/fa";
  import { MdEmail } from "react-icons/md";
  import { IoClose, IoChevronForward } from "react-icons/io5";
  import { useNavigate } from "react-router-dom";

  type ModalKind = "service" | "privacy" | "marketing" | null;

  const AgreementModal = ({
    open, onClose, title, required, content,
  }: {
    open: boolean; onClose: () => void; title: string; required?: boolean; content: string;
  }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
        <div className="w-[620px] max-w-[92vw] rounded-xl bg-white shadow-xl border border-teal-100" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="text-sm font-semibold text-gray-800">
              {title} {required && <span className="text-gray-400">(필수)</span>}
            </div>
            <button className="p-1 rounded hover:bg-gray-100" onClick={onClose}><IoClose className="text-xl text-gray-500" /></button>
          </div>
          <div className="px-5 py-4">
            <div className="border rounded-md p-4 bg-gray-50 text-sm text-gray-700 max-h-96 overflow-y-auto leading-6">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [allAgree, setAllAgree] = useState(false);
    const [termsService, setTermsService] = useState(false);   // 필수
    const [termsPrivacy, setTermsPrivacy] = useState(false);   // 필수
    const [termsMarketing, setTermsMarketing] = useState(false); // 선택

    const [modal, setModal] = useState<ModalKind>(null);
    const navigate = useNavigate(); 

    const toggleAll = () => {
      const next = !allAgree;
      setAllAgree(next);
      setTermsService(next);
      setTermsPrivacy(next);
      setTermsMarketing(next);
    };
    const syncAll = (svc = termsService, prv = termsPrivacy, mkt = termsMarketing) =>
      setAllAgree(svc && prv && mkt);

    const onChangeService = () => { const v = !termsService; setTermsService(v); syncAll(v, termsPrivacy, termsMarketing); };
    const onChangePrivacy = () => { const v = !termsPrivacy; setTermsPrivacy(v); syncAll(termsService, v, termsMarketing); };
    const onChangeMarketing = () => { const v = !termsMarketing; setTermsMarketing(v); syncAll(termsService, termsPrivacy, v); };

    const passwordsMatch = password !== "" && password === password2;
    const requiredAgreed = termsService && termsPrivacy;
    const isFormValid =
      email.trim() && username.trim() && password.trim() && password2.trim() &&
      passwordsMatch && requiredAgreed;

    const TEXT =
      "Neque sociis tellus consectetur condimentum... (약관 원문을 여기에 넣으세요)";

    return (
      <>
        <AgreementModal open={modal === "service"} onClose={() => setModal(null)} title="서비스 이용약관" required content={TEXT} />
        <AgreementModal open={modal === "privacy"} onClose={() => setModal(null)} title="개인정보 수집 및 이용 동의" required content={TEXT} />
        <AgreementModal open={modal === "marketing"} onClose={() => setModal(null)} title="이벤트/마케팅 수신 동의" content={TEXT} />

        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-center text-lg font-semibold mb-6">회원가입</h2>

            {/* 이메일 */}
            <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
              <MdEmail className="text-gray-400 mr-2" />
              <input
                type="email" placeholder="이메일을 입력해주세요"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* 아이디 */}
            <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text" placeholder="아이디를 입력해주세요"
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* 비밀번호 */}
            <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password" placeholder="비밀번호를 입력해주세요"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-2 bg-gray-50">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password" placeholder="비밀번호를 다시 입력해주세요"
                value={password2} onChange={(e) => setPassword2(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {password2.length > 0 && !passwordsMatch && (
              <div className="w-[600px] text-xs text-red-500 mb-2">비밀번호가 일치하지 않습니다.</div>
            )}

            {/* 약관 영역 */}
            <div className="w-[600px] mt-6 mb-28">
              <div className="mb-3 font-semibold">전체동의</div>

              {/* 전체동의(텍스트 왼쪽, 체크박스 맨 오른쪽) */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700">모든 약관에 동의합니다</span>
                <span className="relative inline-flex items-center">
                  <input
                    type="checkbox" checked={allAgree} onChange={toggleAll}
                    className="peer appearance-none w-5 h-5 border-2 border-primary-300 rounded-md
                              checked:bg-primary-300 checked:border-primary-300 transition"
                  />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </span>
              </div>

              {/* 개별 약관들: 텍스트+화살표 ▶  |  (오른쪽 끝) 체크박스 */}
              <ul className="space-y-3">
                {/* 서비스 이용약관 */}
                <li className="flex items-center justify-between">
                  {/* 왼쪽: 텍스트 + ▶ 버튼(모달 열기) */}
                  <button
                    type="button"
                    onClick={() => setModal("service")}
                    className="group flex items-center gap-1 text-sm"
                  >
                    <span className="text-teal-500 mr-2">필수</span>
                    <span className="text-gray-700">서비스 이용약관</span>
                    <IoChevronForward className="text-gray-400 group-hover:text-gray-600" />
                  </button>

                  {/* 오른쪽 끝: 체크박스 */}
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox" checked={termsService} onChange={onChangeService}
                      className="peer appearance-none w-5 h-5 border-2 border-primary-300 rounded-md
                                checked:bg-primary-300 checked:border-primary-300 transition"
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </span>
                </li>

                {/* 개인정보 수집 및 이용 동의 */}
                <li className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setModal("privacy")}
                    className="group flex items-center gap-1 text-sm"
                  >
                    <span className="text-teal-500 mr-2">필수</span>
                    <span className="text-gray-700">개인정보 수집 및 이용 동의</span>
                    <IoChevronForward className="text-gray-400 group-hover:text-gray-600" />
                  </button>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox" checked={termsPrivacy} onChange={onChangePrivacy}
                      className="peer appearance-none w-5 h-5 border-2 border-primary-300 rounded-md
                                checked:bg-primary-300 checked:border-primary-300 transition"
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </span>
                </li>

                {/* 마케팅 수신 동의(선택) */}
                <li className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setModal("marketing")}
                    className="group flex items-center gap-1 text-sm"
                  >
                    <span className="text-gray-400 mr-2">선택</span>
                    <span className="text-gray-700">이벤트/마케팅 수신 동의</span>
                    <IoChevronForward className="text-gray-400 group-hover:text-gray-600" />
                  </button>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox" checked={termsMarketing} onChange={onChangeMarketing}
                      className="peer appearance-none w-5 h-5 border-2 border-primary-300 rounded-md
                                checked:bg-primary-300 checked:border-primary-300 transition"
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* 회원가입 버튼 */}
            <button
              className={`w-[600px] h-14 rounded-md font-semibold text-sm transition ${
                isFormValid ? "bg-primary-300 text-white hover:bg-primary-400" : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
              onClick = {() => navigate("/profile")}
            >
              프로필작성하기
            </button>

            {/* 로그인 링크 */}
            <p className="mt-4 text-center text-sm text-gray-500">
              이미 회원이신가요? <a href="/login" className="text-primary-300 hover:underline">로그인하기</a>
            </p>
          </div>
        </div>
      </>
    );
  };

  export default RegisterForm;
