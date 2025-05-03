import {Injectable, signal} from "@angular/core";
import {Message, MessageSeverity} from "../models/message.model";


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  #message = signal<Message | null>(null);
  message = this.#message.asReadonly();

  showMessage(severity: MessageSeverity, text: string) {
    this.#message.set({severity, text});
    setTimeout(() => {
      this.#message.set(null);
    }, 5000);
  }
  
}
