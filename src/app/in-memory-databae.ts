import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './models/category.model';
import { Entry } from './models/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            { id: 1, name: 'Moradia', description: 'Pagamento de contas da casa' },
            { id: 2, name: 'Saúde', description: 'Plano de saúde e remérios' },
            { id: 3, name: 'Lazer', description: 'Cinema, parques, praias, etc' },
            { id: 4, name: 'Salário', description: 'Recebimento de salário' },
            { id: 5, name: 'Freelas', description: 'Trabalhos com freelancer' },
        ];

        const entries: Entry[] = [
            // tslint:disable-next-line: max-line-length
            { id: 1, name: 'Gás de cozinha', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,00', type: 'expense', description: 'Qualquer descrição' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 2, name: 'Suplementos', categoryId: categories[1].id, category: categories[1], paid: false, date: '14/10/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 3, name: 'Salário na empresa X', categoryId: categories[3].id, category: categories[3], paid: true, date: '15/10/2018', amount: '4405,49', type: 'receipt' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 4, name: 'Aluguel de filme', categoryId: categories[2].id, category: categories[2], paid: true, date: '16/10/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 5, name: 'Suplementos', categoryId: categories[1].id, category: categories[1], paid: true, date: '17/10/2018', amount: '30,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 6, name: 'Video game da filha', categoryId: categories[2].id, category: categories[2], paid: false, date: '17/10/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 11, name: 'Uber', categoryId: categories[1].id, category: categories[1], paid: true, date: '17/10/2018', amount: '30,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 12, name: 'Aluguel', categoryId: categories[2].id, category: categories[2], paid: false, date: '23/10/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 13, name: 'Gás de cozinha', categoryId: categories[1].id, category: categories[1], paid: false, date: '25/10/2018', amount: '30,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 14, name: 'Pagamento pelo projeto XYZ', categoryId: categories[4].id, category: categories[4], paid: true, date: '25/10/2018', amount: '2980,00', type: 'receipt' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 19, name: 'Aluguel de filme', categoryId: categories[2].id, category: categories[2], paid: false, date: '07/11/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 21, name: 'Video game da filha', categoryId: categories[1].id, category: categories[1], paid: true, date: '17/11/2018', amount: '30,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 22, name: 'Cinema', categoryId: categories[2].id, category: categories[2], paid: true, date: '18/11/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 23, name: 'Jiu Jitsu', categoryId: categories[1].id, category: categories[1], paid: false, date: '21/11/2018', amount: '130,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 44, name: 'Uber', categoryId: categories[2].id, category: categories[0], paid: true, date: '28/11/2018', amount: '15,00', type: 'expense' } as Entry,
            // tslint:disable-next-line: max-line-length
            { id: 55, name: 'Cinema', categoryId: categories[1].id, category: categories[2], paid: false, date: '28/11/2018', amount: '30,00', type: 'expense' } as Entry,
        ];

        return { categories, entries };
    }
}
