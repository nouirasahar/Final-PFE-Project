import { Component } from '@angular/core'; 
import { RouterOutlet } from '@angular/router'; 
import { AdminComponent } from './admin/admin.component'; 
import { SidebarComponent } from './sidebar/sidebar.component'; 
import { ordersComponent } from './orders/orders.component'; 
import { paymentsComponent } from './payments/payments.component'; 
import { productsComponent } from './products/products.component'; 
import { usersComponent } from './users/users.component'; 
@Component({ 
    selector: 'app-root', 
    standalone: true, 
    imports:[ 
    ordersComponent, 
    paymentsComponent, 
    productsComponent, 
    usersComponent, 
    AdminComponent, 
    SidebarComponent, 
    RouterOutlet 
  ], 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.scss'] 
 }) 
export class AppComponent { 
  title = 'user-test'; 
} 
