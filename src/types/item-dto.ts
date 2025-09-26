// DTOs para comunicação com a API backend - Itens

export interface CreateItemDto {
  title: string;
  description?: string;
  price?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  link?: string;
  imageUrl?: string;
  quantity?: {
    desired: number;
  };
  itemType: 'SPECIFIC_PRODUCT' | 'ONGOING_SUGGESTION';
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  price?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  link?: string;
  imageUrl?: string;
  quantity?: {
    desired: number;
  };
  itemType?: 'SPECIFIC_PRODUCT' | 'ONGOING_SUGGESTION';
}
