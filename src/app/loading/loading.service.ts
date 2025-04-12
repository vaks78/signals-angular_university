import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {

  #loading = signal(false);
  loading = this.#loading.asReadonly();

  
  loadingOnOff(on: boolean){
    this.#loading.set(on);
  }
}
