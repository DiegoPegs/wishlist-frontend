import { useState } from 'react';
import Link from 'next/link';
import { Dependent } from '@/types/dependent';
import { AddGuardianModal } from './AddGuardianModal';

interface DependentCardProps {
  dependent: Dependent;
  onAddGuardian?: (dependentId: string) => void;
  onRemoveGuardian?: (dependentId: string) => void;
}

const relationshipLabels = {
  son: 'Filho',
  daughter: 'Filha',
  brother: 'Irmão',
  sister: 'Irmã',
  nephew: 'Sobrinho',
  niece: 'Sobrinha',
  other: 'Outro',
};

export function DependentCard({ dependent, onRemoveGuardian }: DependentCardProps) {
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const age = calculateAge(dependent.birthDate);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dark mb-2">
              {dependent.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Parentesco:</span> {relationshipLabels[dependent.relationship]}
              </p>
              <p>
                <span className="font-medium">Idade:</span> {age} anos
              </p>
              <p>
                <span className="font-medium">Nascido em:</span> {formatDate(dependent.birthDate)}
              </p>
            </div>
          </div>
          <div className="ml-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Dependente
            </span>
          </div>
        </div>

        {dependent.secondGuardianId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Segundo Guardião:</h4>
            <p className="text-sm text-gray-600">{dependent.secondGuardianName}</p>
            {onRemoveGuardian && (
              <button
                onClick={() => onRemoveGuardian(dependent.id)}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                Remover segundo guardião
              </button>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/dependents/${dependent.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Gerenciar Listas
          </Link>

          <div className="flex items-center space-x-2">
            {!dependent.secondGuardianId && (
              <button
                onClick={() => setShowAddGuardianModal(true)}
                className="text-gray-400 hover:text-gray-600"
                title="Adicionar segundo guardião"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}

            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showAddGuardianModal && (
        <AddGuardianModal
          dependentId={dependent.id}
          dependentName={dependent.name}
          onClose={() => setShowAddGuardianModal(false)}
          onSuccess={() => {
            // O hook useDependents irá atualizar automaticamente
          }}
        />
      )}
    </div>
  );
}
