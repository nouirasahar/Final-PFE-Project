//app.routes 
import { Routes } from '@angular/router'; 
import { AdminComponent } from './admin/admin.component'; 
import { SidebarComponent } from './sidebar/sidebar.component'; 
import { UpdateComponent } from './update/update.component'; 
import { categoriesComponent } from './categories/categories.component'; 
import { inventoryComponent } from './inventory/inventory.component'; 
import { productsComponent } from './products/products.component'; 
import { reviewsComponent } from './reviews/reviews.component'; 
import { suppliersComponent } from './suppliers/suppliers.component'; 
import { usersComponent } from './users/users.component'; 
export const routes: Routes = [ 
  { path: 'categories', component: categoriesComponent }, 
  { path: 'inventory', component: inventoryComponent }, 
  { path: 'products', component: productsComponent }, 
  { path: 'reviews', component: reviewsComponent }, 
  { path: 'suppliers', component: suppliersComponent }, 
  { path: 'users', component: usersComponent }, 
{ path: 'admin', component: AdminComponent }, 
{ path: 'sidebar', component: SidebarComponent}, 
{ path: 'update/:table/:id', component: UpdateComponent }, 
{ path: '', redirectTo: '/admin', pathMatch: 'full' } 
]; 
