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

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面图' })
  readonly coverUrl: string;

  @ApiPropertyOptional({ description: '文章状态' })
  readonly status: string;

  @IsNumber()
  @ApiPropertyOptional({ description: '文章分类' })
  readonly category: number;

  @IsNumber()
  @ApiPropertyOptional({ description: '是否推荐' })
  readonly isRecommend: number;

  @ApiPropertyOptional({ description: '文章标签' })
  readonly tag: string;
}

export class PostInfoDto {
  public id: number;
  public title: string;
  public content: string;
  public contentHtml: string;
  public summary: string;
  public coverUrl: string;
  public isRecommend: number;
  public status: string;
  public userId: string;
  public author: string;
  public category: string;
  public tags: string[];
  public count: number;
  public likeCount: number;
}

export class QueryPostPageDto {
  @ApiPropertyOptional({ description: '查询关键字' })
  readonly keyword: string;

  @ApiPropertyOptional({ description: '当前页码' })
  readonly pageNum: number;

  @ApiPropertyOptional({ description: '每页多少条' })
  readonly pageSize: number;
}
