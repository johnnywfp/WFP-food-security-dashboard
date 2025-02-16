import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ROUTES} from './app.routes';
import {AppComponent} from './app.component';
import {AppConfig} from './app.config';
import {ErrorComponent} from './pages/base-pages/error/error.component';
import {ComponentsModule} from './components/components.module';
import {LoaderModule} from './components/loader/loader.module';
import {HelperService} from './layout/helper/helper.service';
import {HelperComponent} from './layout/helper/helper.component';
import {NewWidgetModule} from './layout/new-widget/widget.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsTemplateModule} from "./template-components/components-template.module";
import {BsModalRef, ModalModule} from "ngx-bootstrap";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        ErrorComponent,
        HelperComponent
    ],
    imports: [
        ComponentsModule,
        ComponentsTemplateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,

        RouterModule.forRoot(ROUTES, {
            useHash: true,
            preloadingStrategy: PreloadAllModules,
            relativeLinkResolution: 'legacy'
        }),
        LoaderModule,
        NewWidgetModule,
        ModalModule.forRoot(),
        NgxDatatableModule
    ],
    providers: [
        HelperService,
        BsModalRef,
        AppConfig,
    ]
})
export class AppModule {
}

// export NODE_OPTIONS=--openssl-legacy-provider && ng serve
