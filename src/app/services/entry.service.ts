import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Entry } from '../models/entry.model';
import { BaseResourceService } from '../shared/services/base-resource.service';
import { CategoryService } from './category.service';

@Injectable({
    providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

    constructor(protected injector: Injector, protected categoryService: CategoryService) {
        super('api/entries', injector);
    }

    create(entry: Entry): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                return super.create(entry);
            })
        );
    }

    update(entry: Entry): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                return super.update(entry);
            })
        );
    }

    protected jsonDataToResource(jsonObject: any): Entry {
        return Object.assign(new Entry(), jsonObject);
    }

    protected jsonDataToResources(jsonObject: any[]): Entry[] {
        const entries: Entry[] = [];
        jsonObject.forEach(e => { entries.push(Object.assign(new Entry(), e)); });
        return entries;
    }
}
