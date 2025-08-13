export interface ResponseFilter<DTO> {
  total: number;
  currentPage: number;
  nextPage?: number;
  prevPage?: number;
  data: DTO[];
}
