import { Component } from '@angular/core'; 
import { RouterOutlet } from '@angular/router'; 
import { AdminComponent } from './admin/admin.component'; 
import { SidebarComponent } from './sidebar/sidebar.component'; 
import { usersComponent } from './users/users.component'; 
import { productsComponent } from './products/products.component'; 
import { ordersComponent } from './orders/orders.component'; 
import { paymentsComponent } from './payments/payments.component'; 
import { subscriptionsComponent } from './subscriptions/subscriptions.component'; 
@Component({ 
    selector: 'app-root', 
    standalone: true, 
    imports:[ 
    usersComponent, 
    productsComponent, 
    ordersComponent, 
    paymentsComponent, 
    subscriptionsComponent, 
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
