import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';
import { SignupComponent } from './components/signup';
import { AuthGuard } from './helpers';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'customers', canActivate: [AuthGuard], loadChildren: () => import('./components/customers/customers.module').then(m => m.CustomersModule) },
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
