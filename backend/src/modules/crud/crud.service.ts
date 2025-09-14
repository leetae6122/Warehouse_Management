/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { generateKey } from '../cache/cache.helper';
import { Injectable } from '@nestjs/common';
import { FilterCrudDto } from './filter/filter-crud.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CrudService {
  protected module: any;

  constructor(
    protected readonly cacheService: CacheService,
    protected readonly prisma: PrismaService,
    private readonly cacheKey: keyof PrismaClient & string,
  ) {
    this.module = this.prisma[this.cacheKey];
  }

  private async getOrSetCache<T>(
    key: string,
    cb: () => Promise<T>,
  ): Promise<T> {
    const cacheItem = await this.cacheService.get<T>(key);
    console.log(cacheItem);
    if (cacheItem !== undefined && cacheItem !== null) {
      console.log('Return cacheItem');
      return cacheItem;
    }
    const data = await cb();
    console.log(data);
    await this.cacheService.set(key, data);
    return data;
  }

  async getList(filterCrudDto: FilterCrudDto): Promise<any> {
    const cacheKey = generateKey(`${this.cacheKey}-list`, filterCrudDto);

    return this.getOrSetCache(cacheKey, async () => {
      const page: number = filterCrudDto.page || 1;
      const size: number = filterCrudDto.size || 10;
      const where: object = filterCrudDto.where || {};
      const select = filterCrudDto.select || null;
      const include = filterCrudDto.include || {};
      const orderBy = filterCrudDto.orderBy || {};
      const skip = (page - 1) * size;

      const total: number = (await this.module.count({ where })) as number;
      const data = await this.module.findMany({
        select,
        where,
        include,
        skip,
        take: size,
        orderBy,
      });

      return {
        total,
        currentPage: page,
        nextPage: page * size < total ? page + 1 : undefined,
        prevPage: page > 1 ? page - 1 : undefined,
        data,
      };
    });
  }

  async getDataByUnique(where: any, include?: any): Promise<any> {
    const cacheKey = generateKey(`${this.cacheKey}-unique`, where);

    return this.getOrSetCache(cacheKey, async () => {
      return await this.module.findUnique({ where, include });
    });
  }

  async getManyData(where: any, include?: any): Promise<any> {
    const cacheKey = generateKey(`${this.cacheKey}-many`, where);

    return this.getOrSetCache(cacheKey, async () => {
      return await this.module.findMany({ where, include });
    });
  }

  async createData(args: { data: any; include?: any }): Promise<any> {
    const data = await this.module.create({
      data: args.data,
      include: args.include,
    });

    await this.cacheService.clearByPrefix(this.cacheKey);
    return data;
  }

  async updateData(args: {
    where: any;
    data: any;
    include?: any;
  }): Promise<any> {
    const data = await this.module.update({
      where: args.where,
      data: args.data,
      include: args.include,
    });

    await this.cacheService.clearByPrefix(this.cacheKey);
    return data;
  }

  async deleteData(id: number): Promise<void> {
    await this.module.delete({
      where: { id },
    });

    await this.cacheService.clearByPrefix(this.cacheKey);
  }

  async deleteManyData(where: any): Promise<void> {
    await this.module.deleteMany({
      where,
    });

    await this.cacheService.clearByPrefix(this.cacheKey);
  }
}
