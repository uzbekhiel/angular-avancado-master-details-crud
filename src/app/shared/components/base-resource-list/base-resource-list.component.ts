import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

    public resources: T[] = [];

    constructor(protected resourceService: BaseResourceService<T>, protected confirmText: string) { }

    ngOnInit() {
        this.resourceService.getAll().subscribe(
            (resources) => this.resources = resources,
            (error) => alert('Erro ao carregar a lista')
        );
    }

    protected deleteResource(resource: T) {
        const mustDelete = confirm(this.confirmText);
        if (mustDelete) {
            this.resourceService.delete(resource.id).subscribe(
                () => this.resources = this.resources.filter(e => e !== resource),
                () => alert('Erro ao tentar excluir')
            );
        }
    }
}
