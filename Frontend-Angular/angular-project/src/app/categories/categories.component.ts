import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-categories', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './categories.component.html', 
  styleUrls: ['./categories.component.scss'] 
} 
)  
export class categoriesComponent implements OnInit {  
  tables: string[] = []; 
  dataMap: any = {}; 
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
    viewcategories(categories: any): void { 
    console.log('View categories:', categories); 
    alert(`Viewing categories: ${JSON.stringify(categories, null, 2)}`); 
} 
    updatecategories(categories: any): void { 
    this.router.navigate(['/update', 'categories', categories._id]); 
  } 
    deletecategories(categoriesId: string): void { 
    console.log('Delete categories ID:', categoriesId); 
    this.service.deleteItem('categories',categoriesId).subscribe(  
       response => { 
           console.log('categories deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['categories'] = this.dataMap['categories'].filter((categories: any) => categories._id !== categoriesId); 
           alert('categories Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting categories:', error); 
           alert('Failed to delete categories!'); 
       }  
    ); 
} 
} 
