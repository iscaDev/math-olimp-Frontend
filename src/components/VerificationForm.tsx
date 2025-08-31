import { useState, useEffect } from "react";
import { Mail, KeyRound, Home } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function VerifyCode() {
  const [email, setEmail] = useState("");
  const [otp, setCode] = useState("");
  const [message, setMessage] = useState("");

  // sahifa ochilganda localStorage'dan emailni olish
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/users/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (res.status === 200) {
        setMessage("Tasdiq muvaffaqiyatli!");

        // emailni tozalash
        localStorage.removeItem("email");

        // login sahifaga otkazish
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setMessage(`${data.detail}`);
      }
    } catch (err) {
      setMessage("Server bilan bog‘lanishda xatolik");
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      {/* 🔽 Chap-pastda Home tugmasi */}
      <a
        href="/home"
        className="fixed bottom-4 left-4 p-3 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
      >
        <Home className="w-6 h-6" />
      </a>

      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Kodni tasdiqlash</h2>

        {/* Email input + icon */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
            className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* OTP input + icon */}
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tasdiqlash kodi"
            value={otp}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            className="w-full pl-10 pr-3 py-2 border rounded-lg tracking-widest text-center"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Tasdiqlash
        </button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
