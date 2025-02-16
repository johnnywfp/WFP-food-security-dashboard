import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {RouterModule} from '@angular/router';
import {ModalModule, TimepickerModule, TooltipModule} from 'ngx-bootstrap';
import {ImageCropperModule} from 'ngx-image-cropper';
import {CKEditorModule} from 'ngx-ckeditor';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {DebounceModule} from 'ngx-debounce';
import {NewWidgetModule} from '../layout/new-widget/widget.module';
import {NgxSliderModule} from '@angular-slider/ngx-slider';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,
        NgxDatatableModule,
        ReactiveFormsModule,
        RouterModule,
        ModalModule,
        TimepickerModule,
        TooltipModule,
        ImageCropperModule,
        CKEditorModule,
        DragDropModule,
        NgbPaginationModule,
        AngularFileUploaderModule,
        DebounceModule,
        NewWidgetModule,
        NgxSliderModule,

    ],
    providers: [],
    exports: []
})
export class ComponentsModule {
}
