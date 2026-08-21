import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsOptional()
  @IsString()
  country?: string;
}
