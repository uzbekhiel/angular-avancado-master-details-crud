import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';
import { Entry } from '../models/entry.model';
import { BaseResourceService } from '../shared/services/base-resource.service';
import { CategoryService } from './category.service';
import * as moment from 'moment';

moment.updateLocale('pt', {
    months: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
});

@Injectable({
    providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

    constructor(protected injector: Injector, protected categoryService: CategoryService) {
        super('api/entries', injector, Entry.fromJson);
    }

    create(entry: Entry): Observable<Entry> {
        return this.setCategoryAndSendToService(entry, super.create.bind(this));
    }

    update(entry: Entry): Observable<Entry> {
        return this.setCategoryAndSendToService(entry, super.update.bind(this));
    }

    getMonthsAndYears(): Observable<any> {
        return this.getAll().pipe(
            map(entries => {
                const a = [];
                entries.forEach(entry => {
                    const entryDate = moment(entry.date, 'DD/MM/YYYY');
                    a.push({ month: { name: entryDate.format('MMMM'), value: entryDate.month() + 1 }, year: entryDate.year() });
                });
                return a;
            })
        );
    }

    getByMonthAndYear(month: number, year: number): Observable<any> {
        return this.getAll().pipe(
            map(entries => {
                return this.filterByMonthAndYear(entries, month, year);
            })
        );
    }

    private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
        return entries.filter(entry => {
            const entryDate = moment(entry.date, 'DD/MM/YYYY');
            // tslint:disable-next-line: triple-equals
            const monthMatches = (entryDate.month() + 1) == month;
            // tslint:disable-next-line: triple-equals
            const yearMatches = entryDate.year() == year;
            if (monthMatches && yearMatches) { return entry; }
        });
    }

    private setCategoryAndSendToService(entry: Entry, sendFn: any): Observable<any> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                return sendFn(entry);
            }),
            catchError(this.handleError)
        );
    }
}
