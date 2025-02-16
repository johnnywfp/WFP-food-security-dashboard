import {NgModule} from '@angular/core';
import {LoaderFullComponent} from './loader-full/loader-full.component';
import {MapboxMapComponent} from "./mapbox/mapbox.component";
import {LoaderModule} from "../components/loader/loader.module";

@NgModule({
    declarations: [
        LoaderFullComponent,
        MapboxMapComponent
    ],
    imports: [
        LoaderModule
    ],
    providers: [],
    exports: [
        LoaderFullComponent,
        MapboxMapComponent
    ]
})
export class ComponentsTemplateModule {
}
