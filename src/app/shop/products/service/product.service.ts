import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Category, Product } from '../product.interface';
import { BehaviorSubject, catchError, filter, switchMap } from 'rxjs';
import { HttpErrorService } from '../../utilities/http-error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private httpErrorService = inject(HttpErrorService);
  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  private filterByCategorySubject = new BehaviorSubject<string | undefined>(undefined);
  private filterByCategory$ = this.filterByCategorySubject.asObservable();

  readonly products$ = this.filterByCategory$.pipe(
    switchMap((category) => {
      const url = new URL(`${environment.fakeStoreApi}/products`);
      if (category) {
        url.searchParams.set('categoryId', category);
      }
      return this.http.get<Product[]>(url.toString());
    })
  );

  readonly productSelected$ = this.productSelectedSubject.asObservable();

  readonly product$ = this.productSelected$.pipe(
    filter(Boolean),
    switchMap((id) => this.http.get<Product>(`${environment.fakeStoreApi}/products/${id}`)),
    catchError((error) => this.httpErrorService.handleError(error))
  );

  readonly categories$ = this.http.get<Category[]>(`${environment.fakeStoreApi}/categories`);

  productSelected(id: number) {
    this.productSelectedSubject.next(id);
  }

  filterByCategory(category?: string) {
    this.filterByCategorySubject.next(category);
  }
}
