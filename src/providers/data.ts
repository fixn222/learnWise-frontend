import { Pagination } from '@/components/ui/pagination';
import { BACKEND_BASE_URL } from '@/constants'
import { ListResponse } from '@/types/index.types';
import { CreateResponse, HttpError } from '@refinedev/core';
import { createDataProvider, CreateDataProviderOptions } from '@refinedev/rest'

const buidHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request faild'

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload?.message) message = payload.message;
  } catch (error) {

  }

  return {
    message ,
    statusCode : response.status
  }
}


const options: CreateDataProviderOptions = {

  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10

      const params: Record<string, string | number> = { page, limit: pageSize }

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';
        const value = String(filter.value);


        if (resource === 'subjects') {
          if (field == 'department') params.department = value;
          if (field == 'name' || field == 'code') params.search = value;


        }

      });
      return params

    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buidHttpError(response);
      const payload: ListResponse = await response.json()
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buidHttpError(response);

      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;


    }
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  

}


const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };