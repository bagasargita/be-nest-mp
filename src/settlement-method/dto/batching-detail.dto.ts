import { IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';

export type BatchingFrequency = 'PerShift' | 'EndOfTheDay' | 'NextDay';

export class CreateBatchingDetailDto {
  @IsEnum(['PerShift', 'EndOfTheDay', 'NextDay'])
  frequency: BatchingFrequency;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  hour?: number;
}

export class UpdateBatchingDetailDto {
  @IsEnum(['PerShift', 'EndOfTheDay', 'NextDay'])
  @IsOptional()
  frequency?: BatchingFrequency;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  hour?: number;
}
