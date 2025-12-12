import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Car } from 'lucide-react';
import { z } from 'zod';
import logoTomazin from '@/assets/logo-tomazin.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { signIn, resetPassword } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isResetMode) {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: error.message,
          });
        } else {
          toast({
            title: 'Email enviado',
            description: 'Verifique sua caixa de entrada para redefinir sua senha.',
          });
          setIsResetMode(false);
        }
      } else {
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
          toast({
            variant: 'destructive',
            title: 'Erro de validação',
            description: validation.error.errors[0].message,
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          let message = 'Erro ao fazer login';
          if (error.message.includes('Invalid login credentials')) {
            message = 'Email ou senha incorretos';
          } else if (error.message.includes('Email not confirmed')) {
            message = 'Confirme seu email antes de fazer login';
          }
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: message,
          });
        } else {
          navigate('/admin');
        }
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro inesperado',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Admin Tomazin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border-border">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto">
              <img 
                src={logoTomazin} 
                alt="Tomazin Veículos" 
                className="h-12 mx-auto"
              />
            </div>
            <CardTitle className="text-2xl font-heading">
              {isResetMode ? 'Recuperar Senha' : 'Painel Administrativo'}
            </CardTitle>
            <CardDescription>
              {isResetMode 
                ? 'Digite seu email para receber o link de recuperação'
                : 'Faça login para acessar o painel'
              }
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50"
                />
              </div>

              {!isResetMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-secondary/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isResetMode ? 'Enviar Link' : 'Entrar'}
              </Button>

              <button
                type="button"
                onClick={() => setIsResetMode(!isResetMode)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isResetMode ? 'Voltar ao login' : 'Esqueci minha senha'}
              </button>

              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Car className="h-4 w-4" />
                Voltar ao site
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
