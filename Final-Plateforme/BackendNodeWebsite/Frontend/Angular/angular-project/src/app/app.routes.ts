//app.routes 
import { Routes } from '@angular/router'; 
import { AdminComponent } from './admin/admin.component'; 
import { SidebarComponent } from './sidebar/sidebar.component'; 
import { UpdateComponent } from './update/update.component'; 
import { categoriesComponent } from './categories/categories.component'; 
import { ordersComponent } from './orders/orders.component'; 
import { productsComponent } from './products/products.component'; 
import { systemlogsComponent } from './systemlogs/systemlogs.component'; 
import { usersComponent } from './users/users.component'; 
export const routes: Routes = [ 
  { path: 'categories', component: categoriesComponent }, 
  { path: 'orders', component: ordersComponent }, 
  { path: 'products', component: productsComponent }, 
  { path: 'systemlogs', component: systemlogsComponent }, 
  { path: 'users', component: usersComponent }, 
{ path: 'admin', component: AdminComponent }, 
{ path: 'sidebar', component: SidebarComponent}, 
{ path: 'update/:table/:id', component: UpdateComponent }, 
{ path: '', redirectTo: '/admin', pathMatch: 'full' } 
]; 
