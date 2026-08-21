import { IsString, IsNumber, IsBoolean, IsArray, Min, Max, IsNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber()
  @Min(10, { message: 'Price is required' })
  @Max(999999999.99, { message: 'Price cannot exceed ₹99,99,99,999.99' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Original price must be 0 or greater' })
  @Max(999999999.99, { message: 'Original price cannot exceed ₹99,99,99,999.99' })
  compareAtPrice: number;

  @IsNumber()
  @Min(0, { message: 'Stock must be 0 or greater' })
  @Max(1000000, { message: 'Stock cannot exceed 1,000,000 units' })
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'Material is required' })
  material: string;

  @IsString()
  @IsNotEmpty({ message: 'Color is required' })
  color: string;

  @IsString()
  @IsNotEmpty({ message: 'Dimensions are required' })
  dimensions: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image URL is required' })
  images: string[];

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  categoryId: string;

  @IsBoolean()
  isFeatured?: boolean;

  @IsBoolean()
  isActive?: boolean;
}
