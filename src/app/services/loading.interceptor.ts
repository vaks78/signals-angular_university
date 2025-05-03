import { HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "./loading.service";
import { finalize } from "rxjs";
import { SkipLoading } from "../loading/loading.component";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Check if the request has the SkipLoading context set to true
    if (req.context.get(SkipLoading)) {
        return next(req); // Skip loading indicator
    }
    loadingService.loadingOnOff(true);
    return next(req).pipe(
        finalize(() => {
            loadingService.loadingOnOff(false);
        })
    );

}   