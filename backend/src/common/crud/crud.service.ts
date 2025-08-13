/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { generateKey } from './cache.helper';
import { Injectable } from '@nestjs/common';
import { FilterCrudDto } from './filter/filter-crud.dto';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CrudService {
  protected module: any;

  constructor(
    protected readonly cacheManager: Cache,
    protected readonly prisma: PrismaService,
    private readonly cacheKey: string,
  ) {
    this.module = (prisma as any)[this.cacheKey];
  }

  async clearCache(): Promise<void> {
    const stores = this.cacheManager.stores[0];
    if (stores) {
      const allKeys = [...stores['_store'].keys()];
      const keysToDelete = allKeys
        .filter((key: string) => key.includes(this.cacheKey))
        .map((k: string) => k.replace(/^keyv:/, ''));
      await this.cacheManager.mdel(keysToDelete);
    }
  }

  async getList(filterCrudDto: FilterCrudDto): Promise<any> {
    const cacheKey = generateKey(`${this.cacheKey}-list`, filterCrudDto);
    const cacheItems = await this.cacheManager.get(cacheKey);

    if (cacheItems) {
      return cacheItems;
    }

    const page = filterCrudDto.page || 1;
    const size = filterCrudDto.size || 10;
    const where = filterCrudDto.where || {};
    const select = filterCrudDto.select || undefined;
    const orderBy = filterCrudDto.orderBy || {};

    const skip = (page - 1) * size;

    const total = await this.module.count({ where });
    const data = await this.module.findMany({
      select,
      where,
      skip,
      take: size,
      orderBy,
    });

    const nextPage = page + 1 > Math.ceil(total / size) ? undefined : page + 1;
    const prevPage = page - 1 < 1 ? undefined : page - 1;

    const result = {
      total,
      currentPage: page,
      nextPage,
      prevPage,
      data,
    };

    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async getDataByUnique(where: any, include?: any): Promise<any> {
    const cacheKey = generateKey(this.cacheKey, where);
    const cacheItem = await this.cacheManager.get(cacheKey);

    if (cacheItem) {
      return cacheItem;
    }

    const data = await this.module.findUnique({
      where,
      include,
    });

    await this.cacheManager.set(cacheKey, data);
    return data;
  }

  async getManyData(where: any, include?: any): Promise<any> {
    const cacheKey = generateKey(`${this.cacheKey}-many`, where);
    const cacheItem = await this.cacheManager.get(cacheKey);

    if (cacheItem) {
      return cacheItem;
    }

    const data = await this.module.findMany({
      where,
      include,
    });

    await this.cacheManager.set(cacheKey, data);
    return data;
  }

  async createData(args: { data: any; include?: any }): Promise<any> {
    const data = await this.module.create({
      data: args.data,
      include: args.include,
    });

    await this.clearCache();
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

    await this.clearCache();
    return data;
  }

  async deleteData(id: number): Promise<void> {
    await this.module.delete({
      where: { id },
    });

    await this.clearCache();
  }

  async deleteManyData(where: any): Promise<void> {
    await this.module.deleteMany({
      where,
    });

    await this.clearCache();
  }
}
