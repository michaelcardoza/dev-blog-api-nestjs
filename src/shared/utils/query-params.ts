import { QueryDto } from '@app/shared/dto';

type BuildQueryParamsOptions = {
  alias?: string;
};

export const buildOrderByQueryParams = (alias: string, sort: string) => {
  return sort.split(',').reduce((acc, current) => {
    const key = current.startsWith('-') ? current.substring(1) : current;
    return {
      ...acc,
      [alias ? `${alias}.${key}` : key]: current.startsWith('-')
        ? 'DESC'
        : 'ASC',
    };
  }, {});
};

export const buildQueryParams = (
  query: QueryDto,
  options?: BuildQueryParamsOptions,
) => {
  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;
  const sort = buildOrderByQueryParams(
    options?.alias ?? null,
    query?.sort ?? '-createdAt',
  );

  return {
    skip: page === 1 ? 0 : (page - 1) * limit,
    take: Number(limit),
    page: Number(page),
    sort,
  };
};
