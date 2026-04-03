import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, Mail, Lock, User, ArrowRight, Loader2, Phone, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast({ title: t("login.passwordsMismatch") || "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: t("login.signUpFailed") || "Sign up failed", description: error, variant: "destructive" });
      } else {
        toast({ title: t("login.accountCreated") || "Account created! 🌱", description: t("login.checkEmail") || "Check your email to confirm your account." });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: t("login.signInFailed") || "Sign in failed", description: error, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  const sendOtp = () => {
    if (!phone || phone.length < 10) {
      toast({ title: t("login.invalidPhone") || "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast({ title: t("login.otpSent") || "OTP Sent! 📱", description: `${t("login.demoOtp") || "Demo OTP"}: ${code}` });
    }, 1000);
  };

  const verifyOtp = async () => {
    if (otp !== generatedOtp) {
      toast({ title: t("login.invalidOtp") || "Invalid OTP", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Demo: sign in with a demo account for phone auth
    const demoEmail = `${phone}@phone.cropwise.demo`;
    const demoPass = `phone_${phone}_demo`;
    // Try sign in first, if fails, sign up
    const { error: signInError } = await signIn(demoEmail, demoPass);
    if (signInError) {
      const { error: signUpError } = await signUp(demoEmail, demoPass, `Farmer ${phone.slice(-4)}`);
      if (signUpError) {
        // Try sign in again after signup
        const { error } = await signIn(demoEmail, demoPass);
        if (error) {
          toast({ title: t("login.otpVerified") || "OTP Verified! ✅", description: t("login.checkEmail") || "Please check your email to confirm." });
          setLoading(false);
          return;
        }
      }
      toast({ title: t("login.accountCreated") || "Account created! 🌱" });
    }
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-2xl font-bold mb-8">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="text-primary">Crop</span><span className="text-foreground">Wise</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-foreground font-display text-center mb-1">
            {isSignUp ? t("login.createAccount") : t("login.title")}
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">{t("login.subtitle")}</p>

          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => { setLoginMethod("email"); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${loginMethod === "email" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}>
              <Mail className="w-4 h-4" /> {t("login.email")}
            </button>
            <button onClick={() => { setLoginMethod("phone"); setIsSignUp(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${loginMethod === "phone" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}>
              <Phone className="w-4 h-4" /> {t("login.phone") || "Phone"}
            </button>
          </div>

          {loginMethod === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.fullName")}</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("login.fullName")} className="bg-transparent outline-none text-foreground text-sm w-full" required />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.email")}</label>
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("login.email")} className="bg-transparent outline-none text-foreground text-sm w-full" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.password")}</label>
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login.password")} className="bg-transparent outline-none text-foreground text-sm w-full" required minLength={6} />
                </div>
              </div>
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.confirmPassword")}</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("login.confirmPassword")} className="bg-transparent outline-none text-foreground text-sm w-full" required minLength={6} />
                  </div>
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSignUp ? t("login.createAccount") : t("login.signIn")} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.phoneNumber") || "Phone Number"}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">+91</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" className="bg-transparent outline-none text-foreground text-sm w-full" maxLength={10} />
                    </div>
                  </div>
                  <button onClick={sendOtp} disabled={loading || phone.length < 10} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {t("login.sendOtp") || "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">{t("login.otpSentTo") || "OTP sent to"} +91-{phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.enterOtp") || "Enter OTP"}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" className="bg-transparent outline-none text-foreground text-sm w-full tracking-[0.5em] text-center font-bold" maxLength={4} />
                    </div>
                  </div>
                  <button onClick={verifyOtp} disabled={loading || otp.length < 4} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {t("login.verifyOtp") || "Verify & Sign In"} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-muted-foreground hover:text-foreground text-center">
                    {t("login.changeNumber") || "Change number"}
                  </button>
                </>
              )}
            </div>
          )}

          {loginMethod === "email" && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              {isSignUp ? t("login.haveAccount") : t("login.noAccount")}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                {isSignUp ? t("login.signIn") : t("login.signUp")}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
