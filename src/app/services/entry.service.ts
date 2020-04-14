import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Entry } from '../models/entry.model';

@Injectable({
    providedIn: 'root'
})
export class EntryService {

    private apiPath = 'api/entries';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Entry[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handleError),
            map(this.jsonDataToEntries)
        );
    }

    getById(id: number): Observable<Entry> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handleError),
            map(this.jsonDataToEntry)
        );
    }

    create(entry: Entry): Observable<Entry> {
        return this.http.post(this.apiPath, entry).pipe(
            catchError(this.handleError),
            map(this.jsonDataToEntry)
        );
    }

    update(entry: Entry): Observable<Entry> {
        const url = `${this.apiPath}/${entry.id}`;
        return this.http.put(url, entry).pipe(
            catchError(this.handleError),
            map(() => entry)
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;
        return this.http.delete(url).pipe(
            catchError(this.handleError),
            map(() => null)
        );
    }

    private jsonDataToEntry(jsonObject: any): Entry {
        return Object.assign(new Entry(), jsonObject);
    }

    private jsonDataToEntries(jsonObject: any[]): Entry[] {
        const entries: Entry[] = [];
        jsonObject.forEach(e => { entries.push(Object.assign(new Entry(), e)); });
        return entries;
    }

    private handleError(error: any): Observable<any> {
        console.log('Erro na requisição => ', error);
        return throwError(error);
    }


}
