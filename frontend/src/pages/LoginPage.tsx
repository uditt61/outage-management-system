import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/oms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isLogin && val.length > 0 && !/^[a-zA-Z\s]+$/.test(val)) {
      setNameError("Name can only contain letters and spaces.");
    } else {
      setNameError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (
      !isLogin &&
      val.length > 0 &&
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val)
    ) {
      setPasswordError(
        "Password must be 8+ chars with 1 uppercase, 1 number, and 1 symbol.",
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && (nameError || passwordError)) return;
    setLoading(true);
    try {
      if (isLogin) {
        const result = await login(email, password);
        if (!result.success) {
          toast({
            title: "Login failed",
            description: result.message || "An unknown error occurred.",
            variant: "destructive",
          });
        }
      } else {
        const result = await register(name, email, password, role);
        if (result.success) {
          toast({ title: "Account created successfully!" });
        } else {
          toast({
            title: "Registration failed",
            description:
              result.message || "An unknown registration error occurred.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential, role }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("oms_user", JSON.stringify(data));
        toast({ title: "Successfully logged in with Google!" });
        window.location.href = "/";
      } else {
        toast({
          title: "Google Login failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ title: "An error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle Dot Pattern Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

      {/* Futuristic Floating Particles */}
      <FloatingParticles />

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="shadow-2xl card-moving-border">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Outage Management
            </CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="John Doe"
                    required
                  />
                  {nameError && (
                    <p className="text-xs text-destructive mt-1">{nameError}</p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {!isLogin && passwordError && (
                  <p className="text-xs text-destructive mt-1">
                    {passwordError}
                  </p>
                )}
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={role}
                    onValueChange={(v) => setRole(v as UserRole)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                type="submit"
                className="w-full btn-moving-border"
                disabled={
                  loading || (!isLogin && (!!nameError || !!passwordError))
                }
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Or continue with
              </div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  toast({
                    title: "Google Login Failed",
                    variant: "destructive",
                  })
                }
              />
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setNameError("");
                  setPasswordError("");
                }}
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function FloatingParticles() {
  // Generate 30 random particles that will float in the background
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2, // Size between 2px and 6px
        startX: Math.random() * 100, // Random X position (0-100%)
        startY: Math.random() * 100, // Random Y position (0-100%)
        duration: Math.random() * 15 + 15, // Animation duration (15s to 30s)
        delay: Math.random() * 5, // Random start delay
        moveX: Math.random() * 60 - 30, // Drift horizontally by -30px to +30px
        moveY: Math.random() * 60 - 30, // Drift vertically by -30px to +30px
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40 blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.startX}%`,
            top: `${p.startY}%`,
          }}
          animate={{
            x: [0, p.moveX, 0],
            y: [0, p.moveY, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
