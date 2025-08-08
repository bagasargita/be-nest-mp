import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postalcode } from './entities/postalcode.entity';
import { CreatePostalcodeDto } from './dto/create-postalcode.dto';
import { UpdatePostalcodeDto } from './dto/update-postalcode.dto';

@Injectable()
export class PostalcodeService {
  constructor(
    @InjectRepository(Postalcode)
    private postalcodeRepository: Repository<Postalcode>,
  ) {}
  
  async findAll(limit: number = 10, page: number = 1): Promise<{ data: Postalcode[]; total: number; page: number; limit: number }> {
    try {
      const [data, total] = await this.postalcodeRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'ASC' },
      });
      return { data, total, page, limit };
    } catch (error) {
      throw new Error('Failed to fetch postal codes: ' + error.message);
    }
  }

  async findOne(id: number): Promise<Postalcode | null> {
    const postalcode = await this.postalcodeRepository.findOne({ where: { id } });
    if (!postalcode) {
      throw new Error(`Postal code with id ${id} not found`);
    }
    return postalcode;
  }

  async create(dto: CreatePostalcodeDto, username:string): Promise<Postalcode> {
    const postalcode = this.postalcodeRepository.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.postalcodeRepository.save(postalcode);
  }

  async update(id: number, dto: UpdatePostalcodeDto, username: string): Promise<Postalcode> {
    const postalcode = await this.postalcodeRepository.preload({
      id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!postalcode) {
      throw new Error(`Postal code with id ${id} not found`);
    }
    return this.postalcodeRepository.save(postalcode);
  }

  async remove(id: number): Promise<void> {
    const result = await this.postalcodeRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Postal code with id ${id} not found`);
    }
  }

  async search(query: string): Promise<Postalcode[]> {
    return this.postalcodeRepository
      .createQueryBuilder('postalcode')
      .where('postalcode.postal_code LIKE :query OR postalcode.sub_district LIKE :query OR postalcode.district LIKE :query OR postalcode.city LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async autocomplete(query: string): Promise<Postalcode[]> {
    return this.postalcodeRepository
      .createQueryBuilder('postalcode')
      .where('postalcode.postal_code LIKE :query OR postalcode.sub_district LIKE :query OR postalcode.district LIKE :query OR postalcode.city LIKE :query', { query: `%${query}%` })
      .limit(10)
      .getMany();
  }

  // Get unique countries
  async getCountries(): Promise<{ country: string }[]> {
    try {
      const result = await this.postalcodeRepository
        .createQueryBuilder('postalcode')
        .select('DISTINCT postalcode.country', 'country')
        .where('postalcode.country IS NOT NULL')
        .andWhere('postalcode.country != :empty', { empty: '' })
        .orderBy('postalcode.country', 'ASC')
        .getRawMany();
      
      return result;
    } catch (error) {
      throw new Error('Failed to fetch countries: ' + error.message);
    }
  }

  // Get provinces by country
  async getProvinces(country: string): Promise<{ province: string }[]> {
    try {
      // Validate required parameters
      if (!country) {
        throw new Error('Country parameter is required');
      }

      const result = await this.postalcodeRepository
        .createQueryBuilder('postalcode')
        .select('DISTINCT postalcode.province', 'province')
        .where('postalcode.country = :country', { country: country.toUpperCase() })
        .andWhere('postalcode.province IS NOT NULL')
        .andWhere('postalcode.province != :empty', { empty: '' })
        .orderBy('postalcode.province', 'ASC')
        .getRawMany();
      
      return result;
    } catch (error) {
      throw new Error('Failed to fetch provinces: ' + error.message);
    }
  }

  // Get cities by province and country
  async getCities(country: string, province: string): Promise<{ city: string }[]> {
    try {
      // Validate required parameters
      if (!country || !province) {
        throw new Error('Country and province parameters are required');
      }

      const result = await this.postalcodeRepository
        .createQueryBuilder('postalcode')
        .select('DISTINCT postalcode.city', 'city')
        .where('postalcode.country = :country', { country : country.toUpperCase() })
        .andWhere('postalcode.province = :province', { province : province.toUpperCase() })
        .andWhere('postalcode.city IS NOT NULL')
        .andWhere('postalcode.city != :empty', { empty: '' })
        .orderBy('postalcode.city', 'ASC')
        .getRawMany();
      
      return result;
    } catch (error) {
      throw new Error('Failed to fetch cities: ' + error.message);
    }
  }

  // Get districts by city, province, and country
  async getDistricts(country: string, province: string, city: string): Promise<{ district: string }[]> {
    try {
      // Validate required parameters
      if (!country || !province || !city) {
        throw new Error('Country, province, and city parameters are required');
      }

      const result = await this.postalcodeRepository
        .createQueryBuilder('postalcode')
        .select('DISTINCT postalcode.district', 'district')
        .where('postalcode.country = :country', { country : country.toUpperCase() })
        .andWhere('postalcode.province = :province', { province : province.toUpperCase() })
        .andWhere('postalcode.city = :city', { city : city.toUpperCase() })
        .andWhere('postalcode.district IS NOT NULL')
        .andWhere('postalcode.district != :empty', { empty: '' })
        .orderBy('postalcode.district', 'ASC')
        .getRawMany();
      
      return result;
    } catch (error) {
      throw new Error('Failed to fetch districts: ' + error.message);
    }
  }

  // Get sub-districts by district, city, province, and country
  async getSubDistricts(country: string, province: string, city: string, district: string): Promise<{ sub_district: string }[]> {
    try {
      // Validate required parameters
      if (!country || !province || !city || !district) {
        throw new Error('Country, province, city, and district parameters are required');
      }

      const result = await this.postalcodeRepository
        .createQueryBuilder('postalcode')
        .select('DISTINCT postalcode.sub_district', 'sub_district')
        .where('postalcode.country = :country', { country: country.toUpperCase() })
        .andWhere('postalcode.province = :province', { province: province.toUpperCase() })
        .andWhere('postalcode.city = :city', { city: city.toUpperCase() })
        .andWhere('postalcode.district = :district', { district: district.toUpperCase() })
        .andWhere('postalcode.sub_district IS NOT NULL')
        .andWhere('postalcode.sub_district != :empty', { empty: '' })
        .orderBy('postalcode.sub_district', 'ASC')
        .getRawMany();
      
      return result;
    } catch (error) {
      throw new Error('Failed to fetch sub-districts: ' + error.message);
    }
  }

  // Get postal codes by complete address hierarchy
  async getPostalCodes(country: string, province: string, city: string, district: string, subDistrict: string): Promise<{ postal_code: string; sub_district: string }[]> {
    try {
      // Validate required parameters
      if (!country || !province || !city || !district || !subDistrict) {
        throw new Error('All location parameters (country, province, city, district, subDistrict) are required');
      }

      const result = await this.postalcodeRepository
        .createQueryBuilder('postalcode')
        .select(['postalcode.postal_code', 'postalcode.sub_district'])
        .where('postalcode.country = :country', { country: country.toUpperCase() })
        .andWhere('postalcode.province = :province', { province: province.toUpperCase() })
        .andWhere('postalcode.city = :city', { city: city.toUpperCase() })
        .andWhere('postalcode.district = :district', { district: district.toUpperCase() })
        .andWhere('postalcode.sub_district = :subDistrict', { subDistrict: subDistrict.toUpperCase() })
        .andWhere('postalcode.postal_code IS NOT NULL')
        .andWhere('postalcode.postal_code != :empty', { empty: '' })
        .orderBy('postalcode.postal_code', 'ASC')
        .getMany();
      
      return result.map(item => ({
        postal_code: item.postal_code,
        sub_district: item.sub_district
      }));
    } catch (error) {
      throw new Error('Failed to fetch postal codes: ' + error.message);
    }
  }

  // Export postal codes to CSV
  async exportToCsv(filters: any = {}): Promise<string> {
    try {
      const queryBuilder = this.postalcodeRepository.createQueryBuilder('postalcode');
      
      // Apply filters
      if (filters.country) {
        queryBuilder.andWhere('postalcode.country ILIKE :country', { 
          country: `%${filters.country}%` 
        });
      }
      if (filters.province) {
        queryBuilder.andWhere('postalcode.province ILIKE :province', { 
          province: `%${filters.province}%` 
        });
      }
      if (filters.city) {
        queryBuilder.andWhere('postalcode.city ILIKE :city', { 
          city: `%${filters.city}%` 
        });
      }
      if (filters.postal_code) {
        queryBuilder.andWhere('postalcode.postal_code ILIKE :postal_code', { 
          postal_code: `%${filters.postal_code}%` 
        });
      }

      const results = await queryBuilder
        .orderBy('postalcode.country', 'ASC')
        .addOrderBy('postalcode.province', 'ASC')
        .addOrderBy('postalcode.city', 'ASC')
        .getMany();

      // Generate CSV content
      const header = 'Country,Province,City,District,Sub District,Postal Code\n';
      const rows = results.map(row => 
        `"${row.country}","${row.province}","${row.city}","${row.district}","${row.sub_district}","${row.postal_code}"`
      ).join('\n');

      return header + rows;
    } catch (error) {
      throw new Error('Failed to export postal codes: ' + error.message);
    }
  }

  // Import postal codes from CSV
  async importFromCsv(file: Express.Multer.File, username: string): Promise<{ success: boolean; imported: number; errors: string[] }> {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const csvContent = file.buffer.toString('utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length <= 1) {
        throw new Error('CSV file is empty or contains only headers');
      }

      const errors: string[] = [];
      let imported = 0;
      
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        try {
          const line = lines[i].trim();
          if (!line) continue;

          // Parse CSV line (handle quoted values)
          const columns = this.parseCsvLine(line);
          
          if (columns.length < 6) {
            errors.push(`Line ${i + 1}: Invalid number of columns`);
            continue;
          }

          const [country, province, city, district, sub_district, postal_code] = columns;

          // Validate required fields
          if (!country || !province || !city || !district || !sub_district || !postal_code) {
            errors.push(`Line ${i + 1}: Missing required fields`);
            continue;
          }

          // Check if postal code already exists
          const existing = await this.postalcodeRepository.findOne({
            where: {
              country: country.toUpperCase(),
              province: province.toUpperCase(),
              city: city.toUpperCase(),
              district: district.toUpperCase(),
              sub_district: sub_district.toUpperCase(),
              postal_code: postal_code,
            }
          });

          if (existing) {
            errors.push(`Line ${i + 1}: Postal code already exists`);
            continue;
          }

          // Create new postal code
          const newPostalCode = this.postalcodeRepository.create({
            country: country.toUpperCase(),
            province: province.toUpperCase(),
            city: city.toUpperCase(),
            district: district.toUpperCase(),
            sub_district: sub_district.toUpperCase(),
            postal_code: postal_code,
            created_by: username,
            created_at: new Date(),
          });

          await this.postalcodeRepository.save(newPostalCode);
          imported++;
        } catch (error) {
          errors.push(`Line ${i + 1}: ${error.message}`);
        }
      }

      return {
        success: true,
        imported,
        errors
      };
    } catch (error) {
      throw new Error('Failed to import postal codes: ' + error.message);
    }
  }

  // Helper function to parse CSV line with quoted values
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
}
