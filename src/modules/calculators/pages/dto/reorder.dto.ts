import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class ReorderDto {
  @ApiProperty({ 
    description: 'Array of IDs in desired order', 
    type: [String],
    example: ['uuid-1', 'uuid-2', 'uuid-3'] 
  })
  @IsArray()
  @IsUUID('4', { each: true })
  orderedIds: string[];
}
