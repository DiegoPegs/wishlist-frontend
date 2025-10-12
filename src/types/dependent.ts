export interface Dependent {
  id: string;
  name: string;
  birthDate: string;
  relationship: 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other';
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
  relationship: 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other';
}

export interface UpdateDependentData {
  name?: string;
  birthDate?: string;
  relationship?: 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other';
}

export interface AddGuardianData {
  guardianId: string;
}
