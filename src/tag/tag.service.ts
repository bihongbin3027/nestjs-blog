import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(name: string) {
    return await this.tagRepository.save({ name });
  }

  findByName() {
    console.log('findByName');
  }

  async findByIds(ids: string[]) {
    return this.tagRepository.findBy({ id: In([ids]) });
  }
}
