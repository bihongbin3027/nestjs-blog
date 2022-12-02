import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * ApiProperty 必填参数
 * ApiPropertyOptional 可选参数
 */
export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiProperty({ description: '作者' })
  @IsNotEmpty({ message: '缺少作者信息' })
  readonly author: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly thumb_url: string;

  @IsNumber()
  @ApiProperty({ description: '文章类型' })
  readonly type: number;
}

export class QueryPostPageDto {
  @ApiPropertyOptional({ description: '查询关键字' })
  readonly keyword: string;

  @ApiPropertyOptional({ description: '当前页码' })
  readonly pageNum: number;

  @ApiPropertyOptional({ description: '每页多少条' })
  readonly pageSize: number;
}
