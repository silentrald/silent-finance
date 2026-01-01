import { Pagination } from "@/types";

export function paginationToQuery(pagination: Pagination) {
  return `LIMIT ${(pagination.page - 1) * pagination.items},${pagination.items}`
}

