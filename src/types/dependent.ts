export interface Dependent {
  id: string;
  name: string;
  birthDate: {
    day: number;
    month: number;
    year?: number;
  };
  relationship: 'CHILD' | 'SIBLING' | 'NEPHEW_NIECE' | 'OTHER';
  guardianId: string;
  guardianName: string;
  secondGuardianId?: string;
  secondGuardianName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDependentData {
  fullName: string;
  birthDate?: {
    day: number;
    month: number;
    year?: number;
  };
  relationship: 'CHILD' | 'SIBLING' | 'NEPHEW_NIECE' | 'OTHER';
}

export interface UpdateDependentData {
  name?: string;
  birthDate?: string;
  relationship?: 'CHILD' | 'SIBLING' | 'NEPHEW_NIECE' | 'OTHER';
}

export interface AddGuardianData {
  guardianId: string;
}
