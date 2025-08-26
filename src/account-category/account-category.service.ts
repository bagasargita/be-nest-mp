import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AccountCategory } from './entities/account-category.entity';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-account-category.dto';

@Injectable()
export class AccountCategoryService {
  private treeRepo;

  constructor(
    @InjectRepository(AccountCategory)
    private readonly repo: Repository<AccountCategory>,
    private dataSource: DataSource,
  ) {
    this.treeRepo = this.dataSource.getTreeRepository(AccountCategory);
  }

  // Ambil seluruh kategori dalam bentuk tree
  async findAllTree(): Promise<AccountCategory[]> {
    try {
      return this.treeRepo.findTrees();
    } catch (error) {
      throw new Error('Failed to fetch account categories (tree): ' + error.message);
    }
  }

  // Ambil semua kategori (flat)
  async findAll(): Promise<AccountCategory[]> {
    try {
      return this.repo.find({ relations: ['parent'] });
    } catch (error) {
      throw new Error('Failed to fetch account categories: ' + error.message);
    }
  }

  // Ambil satu kategori by id
  async findOne(id: string): Promise<AccountCategory | null> {
    const category = await this.repo.findOne({ where: { id }, relations: ['parent', 'children'] });
    if (!category) {
      throw new NotFoundException(`AccountCategory with id ${id} not found`);
    }
    return category;
  }

  // Buat kategori baru
  async create(dto: CreateAccountCategoryDto, username: string): Promise<AccountCategory[]> {
    const { parentId, ...rest } = dto as any;
    const newCategory = this.repo.create({
      ...rest,
      created_by: username,
      created_at: new Date(),
    });

    if (parentId) {
      const parent = await this.repo.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent AccountCategory with id ${parentId} not found`);
      }
      (newCategory as any).parent = parent;
    }

    return this.repo.save(newCategory);
  }

  // Update kategori
  async update(id: string, dto: UpdateAccountCategoryDto, username: string): Promise<AccountCategory> {
    const category = await this.repo.findOne({ where: { id }, relations: ['parent'] });
    if (!category) {
      throw new NotFoundException(`AccountCategory with id ${id} not found`);
    }

    const { parentId, ...rest } = dto as any;
    Object.assign(category, rest);
    category.updated_by = username;
    category.updated_at = new Date();

    if (dto.hasOwnProperty('parentId')) {
      if (parentId) {
        const parent = await this.repo.findOne({ where: { id: parentId } });
        if (!parent) {
          throw new NotFoundException(`Parent AccountCategory with id ${parentId} not found`);
        }
        category.parent = parent;
      } else {
        category.parent = null;
      }
    }

    return this.repo.save(category);
  }

  // Hapus kategori
  async remove(id: string, username: string): Promise<void> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`AccountCategory with id ${id} not found`);
    }
    category.is_active = false;
    category.updated_by = username;
    category.updated_at = new Date();
    await this.repo.save(category);
  }
}