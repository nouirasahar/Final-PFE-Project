import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-coupons', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './coupons.component.html', 
  styleUrls: ['./coupons.component.scss'] 
} 
)  
export class couponsComponent implements OnInit {  
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
    viewcoupons(coupons: any): void { 
    console.log('View coupons:', coupons); 
    alert(`Viewing coupons: ${JSON.stringify(coupons, null, 2)}`); 
} 
    updatecoupons(coupons: any): void { 
    this.router.navigate(['/update', 'coupons', coupons._id]); 
  } 
    deletecoupons(couponsId: string): void { 
    console.log('Delete coupons ID:', couponsId); 
    this.service.deleteItem('coupons',couponsId).subscribe(  
       response => { 
           console.log('coupons deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['coupons'] = this.dataMap['coupons'].filter((coupons: any) => coupons._id !== couponsId); 
           alert('coupons Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting coupons:', error); 
           alert('Failed to delete coupons!'); 
       }  
    ); 
} 
} 
