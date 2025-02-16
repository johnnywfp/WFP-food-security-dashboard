import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import { UtilsService } from './services/utils/utils.service';

registerLocaleData(localeEn, 'en');

@Component({
    selector: 'app-root',
    template: `
        <loader class="mLoader" *ngIf="utilsService.loaderActive"></loader>
        <router-outlet *ngIf="ready"></router-outlet>`
})
export class AppComponent implements OnInit {
    ready = true;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
    ) {
        moment.locale('en-EN');
    }

    ngOnInit() {
        this.router.navigate(['dashboard']);
    }
}
