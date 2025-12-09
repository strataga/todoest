export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}
