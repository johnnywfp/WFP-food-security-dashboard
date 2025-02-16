import {Component, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {AppConfig} from '../../../app.config';

@Component({
    selector: 'app-error',
    styleUrls: ['./error.style.scss'],
    templateUrl: './error.template.html',
})
export class ErrorComponent {
    @HostBinding('class') classes = 'error-page app';

    router: Router;

    constructor(router: Router, public appConfig: AppConfig) {
        this.router = router;
    }

    searchResult(): void {
        this.router.navigate(['/app', 'dashboard']);
    }
}
