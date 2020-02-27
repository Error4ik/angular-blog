import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminLayoutComponent} from './shared/components/admin-layout/admin-layout.component';
import {AdminRoutingModule} from './admin.routing.module';
import {RouterModule} from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {CreatePageComponent} from './create-page/create-page.component';
import {EditPageComponent} from './edit-page/edit-page.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    EditPageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  exports: [RouterModule]
})

export class AdminModule {

}
