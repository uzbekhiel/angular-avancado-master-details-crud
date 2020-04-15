import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

    public resources: T[] = [];

    constructor(private resourceService: BaseResourceService<T>) { }

    ngOnInit() {
        this.resourceService.getAll().subscribe(
            (resources) => this.resources = resources,
            (error) => alert('Erro ao carregar a lista')
        );
    }

    deleteCategory(resource: T) {
        const mustDelete = confirm('Deseja realmente exlcuir essa categoria');
        if (mustDelete) {
            this.resourceService.delete(resource.id).subscribe(
                () => this.resources = this.resources.filter(e => e !== resource),
                () => alert('Erro ao tentar excluir')
            );
        }
    }
}
