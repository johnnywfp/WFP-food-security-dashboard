import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule} from '@angular/forms';
import {DashboardComponent} from './dashboard.component';
import {AgmCoreModule} from "@agm/core";
import {TooltipModule} from "ngx-bootstrap";
import {_MatMenuDirectivesModule, MatButtonModule, MatMenuModule} from '@angular/material';
import {ComponentsTemplateModule} from "../../template-components/components-template.module";
import {NewWidgetModule} from "../../layout/new-widget/widget.module";
import {DebounceModule} from "ngx-debounce";

export const routes: Routes = [
    {path: '', component: DashboardComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        FormsModule,
        AgmCoreModule,
        TooltipModule,
        MatButtonModule,
        _MatMenuDirectivesModule,
        MatMenuModule,
        ComponentsTemplateModule,
        NewWidgetModule,
        DebounceModule,
    ]
})
export class DashboardModule {
    static routes = routes;
}
