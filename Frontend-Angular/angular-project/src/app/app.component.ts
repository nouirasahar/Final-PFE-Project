import { Component } from '@angular/core'; 
import { RouterOutlet } from '@angular/router'; 
import { AdminComponent } from './admin/admin.component'; 
import { SidebarComponent } from './sidebar/sidebar.component'; 
import { plansComponent } from './plans/plans.component'; 
import { feedbackComponent } from './feedback/feedback.component'; 
import { usersComponent } from './users/users.component'; 
import { servicesComponent } from './services/services.component'; 
import { addressesComponent } from './addresses/addresses.component'; 
import { loyaltyComponent } from './loyalty/loyalty.component'; 
import { profilesComponent } from './profiles/profiles.component'; 
import { couponsComponent } from './coupons/coupons.component'; 
import { groupsComponent } from './groups/groups.component'; 
import { discountsComponent } from './discounts/discounts.component'; 
import { notificationsComponent } from './notifications/notifications.component'; 
import { accountsComponent } from './accounts/accounts.component'; 
import { claimsComponent } from './claims/claims.component'; 
import { settingsComponent } from './settings/settings.component'; 
import { ticketsComponent } from './tickets/tickets.component'; 
import { productsComponent } from './products/products.component'; 
import { paymentsComponent } from './payments/payments.component'; 
import { cancellationsComponent } from './cancellations/cancellations.component'; 
import { promotionsComponent } from './promotions/promotions.component'; 
import { refundsComponent } from './refunds/refunds.component'; 
import { authComponent } from './auth/auth.component'; 
import { engagementsComponent } from './engagements/engagements.component'; 
import { eventsComponent } from './events/events.component'; 
import { inventoryComponent } from './inventory/inventory.component'; 
import { ordersComponent } from './orders/orders.component'; 
import { branchesComponent } from './branches/branches.component'; 
import { categoriesComponent } from './categories/categories.component'; 
import { supportComponent } from './support/support.component'; 
import { historyComponent } from './history/history.component'; 
import { invoicesComponent } from './invoices/invoices.component'; 
import { subscriptionsComponent } from './subscriptions/subscriptions.component'; 
import { reviewsComponent } from './reviews/reviews.component'; 
@Component({ 
    selector: 'app-root', 
    standalone: true, 
    imports:[ 
    plansComponent, 
    feedbackComponent, 
    usersComponent, 
    servicesComponent, 
    addressesComponent, 
    loyaltyComponent, 
    profilesComponent, 
    couponsComponent, 
    groupsComponent, 
    discountsComponent, 
    notificationsComponent, 
    accountsComponent, 
    claimsComponent, 
    settingsComponent, 
    ticketsComponent, 
    productsComponent, 
    paymentsComponent, 
    cancellationsComponent, 
    promotionsComponent, 
    refundsComponent, 
    authComponent, 
    engagementsComponent, 
    eventsComponent, 
    inventoryComponent, 
    ordersComponent, 
    branchesComponent, 
    categoriesComponent, 
    supportComponent, 
    historyComponent, 
    invoicesComponent, 
    subscriptionsComponent, 
    reviewsComponent, 
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
