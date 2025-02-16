import {Component, Input} from '@angular/core';

@Component({
    selector: 'loader-full',
    templateUrl: './loader-full.component.html',
    styleUrls: ['./loader-full.component.scss']
})
export class LoaderFullComponent {
    @Input() size: number = 100;
}
