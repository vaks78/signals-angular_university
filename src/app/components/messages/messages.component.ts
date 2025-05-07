import {Component, inject} from "@angular/core";
import {MessagesService} from "../../services/messages.service";
import {NgClass} from "@angular/common";

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    imports: [
        NgClass
    ]
})
export class MessagesComponent {

    messagesService = inject(MessagesService);
    message = this.messagesService.message;

}
