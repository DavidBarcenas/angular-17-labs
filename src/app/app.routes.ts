import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent) },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.routes').then((c) => c.routes),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then((c) => c.TasksComponent),
  },
  {
    path: 'ui-components',
    loadComponent: () => import('./shared/pages/ui/ui.component').then((c) => c.UiComponent),
  },
  {
    path: 'exploration',
    loadComponent: () =>
      import('./exploration/exploration.component').then((c) => c.ExplorationComponent),
  },
];
