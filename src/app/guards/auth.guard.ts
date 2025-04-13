import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const isUserAuthenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!authService.isLoggedIn()) {
    // Redirect to login page if not authenticated
    return router.navigate(["/login"]).then(() => false);
  }
  return true;
}   