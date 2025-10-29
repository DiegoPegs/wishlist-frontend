import { useAuthStore } from '@/store/auth.store';
import { useMyDependents } from './useMyDependents';

/**
 * Hook para determinar se o usuário atual pode gerenciar uma wishlist/item
 * baseado no ownerId. Retorna true se:
 * 1. O usuário é o dono direto (currentUser.id === ownerId)
 * 2. O usuário é guardião de um dependente que é o dono (myDependents.some(dep => dep.id === ownerId))
 */
export function useCanManage(ownerId?: string) {
  const { user: currentUser } = useAuthStore();
  const { data: myDependents = [] } = useMyDependents();

  if (!ownerId || !currentUser) {
    return false;
  }

  // Verificar se é o dono direto
  const isDirectOwner = currentUser.id === ownerId || currentUser._id === ownerId;

  // Verificar se é guardião de um dependente que é o dono
  const isGuardianOfOwner = myDependents.some(dep => dep.id === ownerId);

  return isDirectOwner || isGuardianOfOwner;
}

/**
 * Hook para determinar se o usuário atual é guardião de um dependente específico
 * baseado no ownerId da wishlist/item
 */
export function useIsGuardianOfDependentOwner(ownerId?: string) {
  const { user: currentUser } = useAuthStore();
  const { data: myDependents = [] } = useMyDependents();

  if (!ownerId || !currentUser) {
    return false;
  }

  // Verificar se é guardião de um dependente que é o dono
  return myDependents.some(dep => dep.id === ownerId);
}
