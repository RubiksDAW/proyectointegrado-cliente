import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('../main/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('../main/edit-profile/edit-profile.module').then(
            (m) => m.EditProfilePageModule
          ),
      },
      {
        path: 'profile-options',
        loadChildren: () =>
          import('../main/profile-options/profile-options.module').then(
            (m) => m.ProfileOptionsPageModule
          ),
      },
      {
        path: 'news',
        loadChildren: () =>
          import('../main/news/news.module').then((m) => m.NewsPageModule),
      },
      {
        path: 'create-route',
        loadChildren: () =>
          import('../main/create-route/create-route.module').then(
            (m) => m.CreateRoutePageModule
          ),
      },
      {
        path: 'route',
        loadChildren: () =>
          import('../route/route.module').then((m) => m.RoutePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
