import {Routes} from '@angular/router';
import {ErrorComponent} from './pages/base-pages/error/error.component';

export const ROUTES: Routes = [
    {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
    },
    {
        path: 'error', component: ErrorComponent
    },
    {
        path: '**', component: ErrorComponent
    }
];
