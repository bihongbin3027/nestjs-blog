import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { TagModule } from 'src/tag/tag.module';
import { PostsController } from './posts.controller';
import { PostsEntity } from './entities/posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    CategoryModule,
    TagModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
