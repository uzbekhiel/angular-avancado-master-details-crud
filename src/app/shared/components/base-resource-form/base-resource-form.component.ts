import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from '../../models/base-resource.model';
import toastr from 'toastr';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[];
    submittingForm = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;

    constructor(
        protected injector: Injector,
        protected resourceService: BaseResourceService<T>,
        public resource: T,
        protected jsonDataToResourceFn: (jsonData) => T
    ) {
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.formBuilder = injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked(): void {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction === 'new') {
            this.createResource();
        } else {
            this.updateResource();
        }
    }

    protected loadResource() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(
                // tslint:disable-next-line: radix
                switchMap(params => this.resourceService.getById(parseInt(params.get('id'))))
            ).subscribe(
                (resource) => {
                    this.resource = resource;
                    this.resourceForm.patchValue(resource);
                },
                (error) => {
                    alert('Erro no servidor, tente mais tarde');
                }
            );
        }
    }

    protected setCurrentAction() {
        this.currentAction = this.route.snapshot.url[0].path === 'new' ? 'new' : 'edit';
    }

    protected setPageTitle() {
        // const resourceName = this.resource.name || '';
        this.pageTitle = this.route.snapshot.url[0].path === 'new' ? this.creationPageTitle() : this.updatePageTitle();
    }

    protected updatePageTitle(): string {
        return 'Edição';
    }

    protected creationPageTitle(): string {
        return 'Novo';
    }

    protected updateResource() {
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.update(resource).subscribe(
            res => this.actionsForSuccess(res),
            error => this.actionsForError(error)
        );
    }

    protected createResource() {
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.create(resource).subscribe(
            res => this.actionsForSuccess(res),
            error => this.actionsForError(error)
        );
    }

    protected actionsForError(error: any): void {
        toastr.error('Ocorreu um erro ao processar sua solicitação');
        this.submittingForm = false;
        console.log(error);
        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body);
        } else {
            this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor tente mais tarde.'];
        }
    }

    protected actionsForSuccess(resource: T): void {
        toastr.success('Solicitação processada com sucesso');
        const baseComponentPath = this.route.snapshot.parent.url[0].path;
        this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
            () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
        );
    }

    protected abstract buildResourceForm(): void;
}
