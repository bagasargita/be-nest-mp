import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, DataSource } from 'typeorm';
import { CreateCdmProviderDto } from './dto/create-cdm-provider.dto';
import { UpdateCdmProviderDto } from './dto/update-cdm-provider.dto';
import { CdmProvider } from './entities/cdm-provider.entity';

@Injectable()
export class CdmProviderService {
  private cdmProviderRepository: TreeRepository<CdmProvider>;

  constructor(
    private dataSource: DataSource,
  ) {
    this.cdmProviderRepository = this.dataSource.getTreeRepository(CdmProvider);
  }

  async create(createCdmProviderDto: CreateCdmProviderDto, username: string): Promise<CdmProvider> {
    const { parent_id, ...cdmProviderData } = createCdmProviderDto;
    const cdmProvider = this.cdmProviderRepository.create(cdmProviderData);

    if (parent_id) {
      const parent = await this.cdmProviderRepository.findOne({ where: { id: parent_id } });
      if (!parent) {
        throw new NotFoundException(`Parent CDM Provider with ID ${parent_id} not found`);
      }
      cdmProvider.parent = parent;
    }

    const entity = this.cdmProviderRepository.create({
      ...createCdmProviderDto,
      created_by: username,
      created_at: new Date(),
    });
    return this.cdmProviderRepository.save(entity);

    return this.cdmProviderRepository.save(cdmProvider);
  }

  async findAll(): Promise<CdmProvider[]> {
    return await this.cdmProviderRepository.findTrees({
      relations: ['parent', 'children']
    });
  }

  async findAllFlat(): Promise<CdmProvider[]> {
    return await this.cdmProviderRepository.find({
      relations: ['parent', 'children'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<CdmProvider> {
    const cdmProvider = await this.cdmProviderRepository.findOne({
      where: { id },
      relations: ['parent', 'children']
    });

    if (!cdmProvider) {
      throw new NotFoundException(`CDM Provider with ID '${id}' not found`);
    }

    return cdmProvider;
  }

  async findChildren(id: string): Promise<CdmProvider> {
    const parent = await this.findOne(id);
    return await this.cdmProviderRepository.findDescendantsTree(parent);
  }

  async findAncestors(id: string): Promise<CdmProvider> {
    const child = await this.findOne(id);
    return await this.cdmProviderRepository.findAncestorsTree(child);
  }

  async update(id: string, updateCdmProviderDto: UpdateCdmProviderDto, username: string): Promise<CdmProvider> {
    const cdmProvider = await this.findOne(id);

    // Prevent circular reference
    if (updateCdmProviderDto.parent_id) {
      if (updateCdmProviderDto.parent_id === id) {
        throw new BadRequestException('A CDM Provider cannot be its own parent');
      }

      // Check if trying to set a descendant as parent
      const descendants = await this.cdmProviderRepository.findDescendants(cdmProvider);
      const isDescendant = descendants.some(desc => desc.id === updateCdmProviderDto.parent_id);

      if (isDescendant) {
        throw new BadRequestException('Cannot set a descendant as parent');
      }
    }

    // Extract parent_id from DTO
    const { parent_id, ...updateFields } = updateCdmProviderDto;

    // Update basic fields
    Object.assign(cdmProvider, updateFields);
    cdmProvider.updated_by = username;
    cdmProvider.updated_at = new Date();

    // Handle parent relationship
    if (parent_id) {
      const parentProvider = await this.cdmProviderRepository.findOne({ where: { id: parent_id } });
      if (!parentProvider) {
        throw new NotFoundException(`Parent CDM Provider with ID '${parent_id}' not found`);
      }
      cdmProvider.parent = parentProvider;
    } else if (parent_id === null) {
      cdmProvider.parent = null;
    }

    return await this.cdmProviderRepository.save(cdmProvider);
  }

  async remove(id: string): Promise<void> {
    const cdmProvider = await this.findOne(id);

    // Check if it has children
    const children = await this.cdmProviderRepository.findDescendants(cdmProvider);
    if (children.length > 1) { // > 1 because findDescendants includes the node itself
      throw new BadRequestException('Cannot delete CDM Provider that has children');
    }

    await this.cdmProviderRepository.remove(cdmProvider);
  }

  async getProviderHierarchy(): Promise<CdmProvider[]> {
    return await this.cdmProviderRepository.findTrees();
  }

  async moveProvider(providerId: string, newParentId: string | null, username: string): Promise<CdmProvider> {
    const provider = await this.findOne(providerId);

    // Prevent circular reference
    if (newParentId) {
      if (newParentId === providerId) {
        throw new BadRequestException('A CDM Provider cannot be its own parent');
      }

      const descendants = await this.cdmProviderRepository.findDescendants(provider);
      const isDescendant = descendants.some(desc => desc.id === newParentId);

      if (isDescendant) {
        throw new BadRequestException('Cannot move provider to its descendant');
      }

      // Set new parent
      const newParent = await this.cdmProviderRepository.findOne({ where: { id: newParentId } });
      if (!newParent) {
        throw new NotFoundException(`Parent CDM Provider with ID '${newParentId}' not found`);
      }
      provider.parent = newParent;
    } else {
      provider.parent = null;
    }

    provider.updated_by = username;
    provider.updated_at = new Date();

    return await this.cdmProviderRepository.save(provider);
  }
}
