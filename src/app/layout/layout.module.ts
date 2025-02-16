import 'jquery-slimscroll';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule, TooltipModule} from 'ngx-bootstrap';
import {ROUTES} from './layout.routes';
import {LayoutComponent} from './layout.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NavbarComponent} from './navbar/navbar.component';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {ComponentsModule} from '../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        ROUTES,
        FormsModule,
        LoadingBarRouterModule,
        ComponentsModule,

    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent,

    ],
    providers: []
})
export class LayoutModule {
}
