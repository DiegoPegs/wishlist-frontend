'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const createWishlistSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  isPublic: z.boolean(),
  eventDate: z.string().optional()
})

type CreateWishlistFormData = z.infer<typeof createWishlistSchema>

export default function NewDependentWishlistPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const dependentId = params.id as string

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateWishlistFormData>({
    resolver: zodResolver(createWishlistSchema),
    defaultValues: {
      isPublic: false
    }
  })

  const onSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implementar chamada para API para criar wishlist do dependente
      // Usar data.title e data.description quando a API for implementada

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Lista de desejos criada com sucesso!')
      router.push(`/dependents/${dependentId}`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar lista de desejos'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/dependents/${dependentId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dependente
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-dark">Criar Lista de Desejos</h1>
          <p className="mt-2 text-gray-600">Crie uma nova lista de desejos para este dependente.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título da Lista *
                </label>
                <input
                  {...register('title')}
                  id="title"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Ex: Lista de Aniversário do João"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Descreva a lista de desejos para este dependente..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              {/* Data do Evento */}
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                  Data do Evento (opcional)
                </label>
                <input
                  {...register('eventDate')}
                  id="eventDate"
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>}
              </div>

              {/* Visibilidade */}
              <div>
                <div className="flex items-center">
                  <input
                    {...register('isPublic')}
                    id="isPublic"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Tornar lista pública
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Listas públicas podem ser visualizadas por outros usuários</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <Link
              href={`/dependents/${dependentId}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancelar
            </Link>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Criar Lista
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
