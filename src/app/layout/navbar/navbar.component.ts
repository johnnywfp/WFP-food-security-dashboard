import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AppConfig} from '../../app.config';
import {BsModalService} from 'ngx-bootstrap';

declare let jQuery: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.template.html'
})
export class NavbarComponent implements OnInit {
    @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
    @Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
    $el: any;
    config: any;

    constructor(
        el: ElementRef,
        config: AppConfig,
        private router: Router,
        private modalService: BsModalService,
    ) {
        this.$el = jQuery(el.nativeElement);
        this.config = config.getConfig();
    }

    toggleSidebar(state): void {
        this.toggleSidebarEvent.emit(state);
    }

    toggleChat(): void {
        this.toggleChatEvent.emit(null);
    }

    logout() {
    }

    ngOnInit(): void {
        setTimeout(() => {
            const $chatNotification = jQuery('#chat-notification');
            $chatNotification.removeClass('hide').addClass('animated fadeIn')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
                    $chatNotification.removeClass('animated fadeIn');
                    setTimeout(() => {
                        $chatNotification.addClass('animated fadeOut')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd' +
                                ' oanimationend animationend', () => {
                                $chatNotification.addClass('hide');
                            });
                    }, 8000);
                });
            $chatNotification.siblings('#toggle-chat')
                .append('<i class="chat-notification-sing animated bounceIn"></i>');
        }, 4000);

        this.$el.find('.input-group-addon + .form-control').on('blur focus', function (e): void {
            jQuery(this).parents('.input-group')
                [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
        });
    }
}
