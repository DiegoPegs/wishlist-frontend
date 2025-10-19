'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/Button'
import { BackButton } from '@/components/ui/BackButton'
import toast from 'react-hot-toast'
import { useTranslations } from '@/hooks/useTranslations'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()
  const t = useTranslations('auth')
  const tErrors = useTranslations('errors')

  const loginSchema = z.object({
    login: z.string().min(1, tErrors('required')),
    password: z.string().min(6, tErrors('passwordTooShort'))
  })

type LoginFormData = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data)
      toast.success(t('loginSuccess'))
      // Redirecionar para o dashboard com o idioma atual
      const currentPath = window.location.pathname
      const locale = currentPath.split('/')[1] || 'pt-BR'
      router.push(`/${locale}/dashboard`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : tErrors('networkError')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Coluna Esquerda - Elementos de Marca */}
        <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex flex-col items-center justify-center p-8 lg:p-12 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-20 h-20 bg-pink-300 rounded-full"></div>
            <div className="absolute bottom-40 right-10 w-28 h-28 bg-blue-300 rounded-full"></div>
          </div>

          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8">
              <Image
                src="/illustration-friends-gifting.svg"
                alt="Amigos trocando presentes"
                width={400}
                height={300}
                className="mx-auto"
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {t('welcomeTitle')}
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              {t('welcomeDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Listas personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Compartilhamento fácil</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Lembretes automáticos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Formulário de Login */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Botão Voltar */}
            <div className="flex justify-start">
              <BackButton />
            </div>
            {/* Logo */}
            <div className="text-center">
              <Image
                src="/logo-kero-full-color.svg"
                alt="Kero Logo"
                width={200}
                height={60}
                className="mx-auto mb-6"
              />
            </div>

            {/* Formulário */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                {t('welcomeBack')}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {t('loginDescription')}
              </p>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* Campo Email/Username */}
                  <div>
                    <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('email')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('login')}
                        id="login"
                        type="text"
                        autoComplete="username"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={t('emailPlaceholder')}
                      />
                    </div>
                    {errors.login && (
                      <p className="mt-2 text-sm text-red-600">{errors.login.message}</p>
                    )}
                  </div>

                  {/* Campo Senha */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('password')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={t('passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                {/* Link Esqueci minha senha */}
                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>

                {/* Mensagem de erro */}
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                {/* Botão de Login */}
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="w-full py-3 text-base font-medium"
                  >
                    {isLoading ? t('loggingIn') : t('login')}
                  </Button>
                </div>

                {/* Link para Cadastro */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {t('noAccount')}{' '}
                    <Link
                      href="/register"
                      className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                    >
                      {t('registerFree')}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}