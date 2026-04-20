import { useState } from "react";
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
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />
              {!isLogin && passwordError && (
                <p className="text-xs text-destructive mt-1">{passwordError}</p>
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
              className="w-full"
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
    </div>
  );
}
