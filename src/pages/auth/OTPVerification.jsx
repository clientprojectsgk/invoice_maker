import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/FormField';

export default function OTPVerification() {
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, demoOtp, reset } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await verifyOTP(otp.join(''));
      navigate(reset ? '/login' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) { navigate('/login'); return null; }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f7fa]">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-gray-200 p-8 card-shadow text-center">
          <h2 className="text-xl font-semibold text-gray-900">Verify OTP</h2>
          <p className="text-sm text-gray-500 mt-1 mb-1">Enter the code sent to</p>
          <p className="text-sm font-medium text-primary-600 mb-5">{email}</p>
          {demoOtp && <p className="text-xs bg-amber-50 border border-amber-100 text-amber-800 p-2 rounded-md mb-4">Demo OTP: <strong>{demoOtp}</strong></p>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-md">{error}</div>}
          <div className="flex justify-center gap-2 mb-5">
            {otp.map((digit, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-10 h-10 text-center text-lg font-semibold p-0"
                maxLength={1}
              />
            ))}
          </div>
          <Button onClick={handleSubmit} className="w-full" loading={loading} disabled={otp.some((d) => !d)}>
            Verify & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
