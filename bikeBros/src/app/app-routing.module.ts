import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
// import ;
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-pass',
    loadChildren: () =>
      import('./pages/forgot-pass/forgot-pass.module').then(
        (m) => m.ForgotPassPageModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'route/:id',
    loadChildren: () =>
      import('./pages/route/route.module').then((m) => m.RoutePageModule),
  },
  {
    path: 'event/:id',
    loadChildren: () =>
      import('./pages/event/event.module').then((m) => m.EventPageModule),
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'map-modal',
    loadChildren: () =>
      import('./pages/map-modal/map-modal.module').then(
        (m) => m.MapModalPageModule
      ),
  },
  {
    path: 'event',
    loadChildren: () =>
      import('./pages/event/event.module').then((m) => m.EventPageModule),
  },  {
    path: 'success-route',
    loadChildren: () => import('./pages/success-route/success-route.module').then( m => m.SuccessRoutePageModule)
  },
  {
    path: 'success-event',
    loadChildren: () => import('./pages/success-event/success-event.module').then( m => m.SuccessEventPageModule)
  },
  {
    path: 'deleted-event',
    loadChildren: () => import('./pages/deleted-event/deleted-event.module').then( m => m.DeletedEventPageModule)
  },
  {
    path: 'deleted-route',
    loadChildren: () => import('./pages/deleted-route/deleted-route.module').then( m => m.DeletedRoutePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
