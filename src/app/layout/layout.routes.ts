import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            {
                path: 'dashboard',
                loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
            }
        ]
    }
];

export const ROUTES = RouterModule.forChild(routes);
