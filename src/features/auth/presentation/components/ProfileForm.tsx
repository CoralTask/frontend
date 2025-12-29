import { useRef, useState } from "react";
import { FaUser, FaBriefcase, FaTags, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfileForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");

  const isFormValid = nickname.trim() && position.trim() && skills.trim();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // TODO: 서버에 저장 요청
    navigate("/main");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center min-h-screen pt-40 bg-white">
      <h2 className="text-lg font-semibold mb-6">프로필 작성</h2>

      {/* 프로필 이미지 업로드 */}
      <div className="relative mb-8">
        <div
          className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          {profileImage ? (
            <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-4xl text-white opacity-50" />
          )}
        </div>

        {/* 카메라 아이콘 */}
        <div
          onClick={handleImageClick}
          className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow cursor-pointer"
        >
          <FaCamera className="text-gray-600 text-sm" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* 닉네임 */}
      <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
        <FaUser className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* 포지션 */}
      <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-4 bg-gray-50">
        <FaBriefcase className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="직무 또는 역할을 입력해주세요 (예: 마케팅, 인사담당자)"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>


      <div className="w-[600px] h-14 flex items-center border rounded-md px-4 mb-10 bg-gray-50">
        <FaTags className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="보유 역량이나 사용 가능한 도구를 입력해주세요 (예: Excel, Notion, CRM)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        className={`w-[600px] h-14 rounded-md font-semibold text-sm transition ${
          isFormValid
            ? "bg-primary-300 text-white hover:bg-primary-400"
            : "bg-gray-300 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        회원가입하기
      </button>
    </form>
  );
}
