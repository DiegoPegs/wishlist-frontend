import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Dependent } from '@/types/dependent';
import { AddGuardianModal } from './AddGuardianModal';
import { formatBirthDateObject, calculateAge } from '@/lib/formatters';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';

interface DependentCardProps {
  dependent: Dependent;
  onAddGuardian?: (dependentId: string) => void;
  onRemoveGuardian?: (dependentId: string) => void;
  onDelete?: (dependentId: string) => void;
}

export function DependentCard({ dependent, onRemoveGuardian, onDelete }: DependentCardProps) {
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
  const t = useTranslations('dependents');
  const { getLocalizedPath } = useLocalizedPath();

  const age = calculateAge(dependent.birthDate);
  const formattedBirthDate = formatBirthDateObject(dependent.birthDate);

  return (
    <>
      <Link href={getLocalizedPath(`/dependents/${dependent.id}`)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark mb-2">
                  {dependent.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">{t('relationship')}:</span> {t(dependent.relationship)}
                  </p>
                  {age !== null && (
                    <p>
                      <span className="font-medium">{t('age')}:</span> {age} {t('years')}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">{t('bornOn')}:</span> {formattedBirthDate}
                  </p>
                </div>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t('dependent')}
                </span>
              </div>
            </div>

            {dependent.secondGuardianId && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-1">{t('secondGuardian')}:</h4>
                <p className="text-sm text-gray-600">{dependent.secondGuardianName}</p>
                {onRemoveGuardian && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveGuardian(dependent.id);
                    }}
                    className="mt-2 text-xs text-red-600 hover:text-red-800"
                  >
                    {t('removeSecondGuardian')}
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                {t('manageLists')}
              </span>

              <div className="flex items-center space-x-2">
                {!dependent.secondGuardianId && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAddGuardianModal(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    title={t('addSecondGuardian')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(dependent.id);
                    }}
                    className="text-gray-400 hover:text-red-600"
                    title={t('deleteDependentTooltip')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {showAddGuardianModal && (
        <AddGuardianModal
          dependentId={dependent.id}
          dependentName={dependent.name}
          onClose={() => setShowAddGuardianModal(false)}
          onSuccess={() => {
            // O hook useMyDependents irá atualizar automaticamente
          }}
        />
      )}
    </>
  );
}