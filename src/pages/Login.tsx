import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: "Sign up failed", description: error, variant: "destructive" });
      } else {
        toast({ title: "Account created! 🌱", description: "Check your email to confirm your account." });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Sign in failed", description: error, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignUp ? t("login.haveAccount") : t("login.noAccount")}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
              {isSignUp ? t("login.signIn") : t("login.signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
