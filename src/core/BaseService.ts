export abstract class BaseService<T> {
  protected repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }
}
