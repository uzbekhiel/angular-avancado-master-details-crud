import { BaseResourceModel } from '../models/base-resource.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> {

    protected http: HttpClient;

    constructor(protected apiPath: string, protected injector: Injector, protected jsonDataToResourceFn: any) {
        this.http = injector.get(HttpClient);
    }

    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleError)
        );
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleError)
        );
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleError)
        );
    }

    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.put(url, resource).pipe(
            map(() => resource),
            catchError(this.handleError)
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;
        return this.http.delete(url).pipe(
            map(() => null),
            catchError(this.handleError)
        );
    }

    protected jsonDataToResource(jsonObject: any): T {
        return this.jsonDataToResourceFn(jsonObject);
    }

    protected jsonDataToResources(jsonObject: any[]): T[] {
        const categories: T[] = [];
        jsonObject.forEach(e => { categories.push(this.jsonDataToResourceFn(e)); });
        return categories;
    }

    protected handleError(error: any): Observable<any> {
        console.log('Erro na requisição => ', error);
        return throwError(error);
    }

}