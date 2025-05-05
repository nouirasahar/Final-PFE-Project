//app.routes 
import { Routes } from '@angular/router'; 
import { AdminComponent } from './admin/admin.component'; 
import { SidebarComponent } from './sidebar/sidebar.component'; 
import { UpdateComponent } from './update/update.component'; 
import { usersComponent } from './users/users.component'; 
import { productsComponent } from './products/products.component'; 
import { ordersComponent } from './orders/orders.component'; 
import { paymentsComponent } from './payments/payments.component'; 
import { subscriptionsComponent } from './subscriptions/subscriptions.component'; 
export const routes: Routes = [ 
  { path: 'users', component: usersComponent }, 
  { path: 'products', component: productsComponent }, 
  { path: 'orders', component: ordersComponent }, 
  { path: 'payments', component: paymentsComponent }, 
  { path: 'subscriptions', component: subscriptionsComponent }, 
{ path: 'admin', component: AdminComponent }, 
{ path: 'sidebar', component: SidebarComponent}, 
{ path: 'update/:table/:id', component: UpdateComponent }, 
{ path: '', redirectTo: '/admin', pathMatch: 'full' } 
]; 
