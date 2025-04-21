import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-products', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './products.component.html', 
  styleUrls: ['./products.component.scss'] 
} 
)  
export class productsComponent implements OnInit {  
  tables: string[] = []; 
  dataMap: any = {}; 
  item: any; 
  constructor(private service: SharedService, private router: Router) {} 
  ngOnInit(): void { 
      this.service.getUsers().subscribe(data => { 
      console.log("Données reçues:", data ); 
      if (data && typeof data === "object") { 
        this.tables = Object.keys(data); 
        this.dataMap = data; 
        } else { 
          this.tables = [];  
          this.dataMap = {};   
        }  
      }  
      );  
    }  
//get columns for the table dynamically  
    getColumns(table: string): string[] { 
        return this.dataMap[table] && this.dataMap[table].length > 0  
          ? Object.keys(this.dataMap[table][0]) : []; 
    } 
 // Get the values of a row dynamically  
    getValues(row: any): any[] {  
      return Object.values(row);  
  }  
// New Methods for the Buttons 
    viewproducts(products: any): void { 
    console.log('View products:', products); 
    alert(`Viewing products: ${JSON.stringify(products, null, 2)}`); 
} 
    updateproducts(products: any): void { 
    this.router.navigate(['/update', 'products', products.id]); 
  } 
    deleteproducts(productsId: string): void { 
    console.log('Delete products ID:', productsId); 
    this.service.deleteItem('products',productsId).subscribe(  
       response => { 
           console.log('products deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['products'] = this.dataMap['products'].filter((products: any) => products.id !== productsId); 
           alert('products Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting products:', error); 
           alert('Failed to delete products!'); 
       }  
    ); 
} 
} 
