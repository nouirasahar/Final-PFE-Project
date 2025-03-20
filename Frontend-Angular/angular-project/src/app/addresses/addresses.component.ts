import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-addresses', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './addresses.component.html', 
  styleUrls: ['./addresses.component.scss'] 
} 
)  
export class addressesComponent implements OnInit {  
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
    viewaddresses(addresses: any): void { 
    console.log('View addresses:', addresses); 
    alert(`Viewing addresses: ${JSON.stringify(addresses, null, 2)}`); 
} 
    updateaddresses(addresses: any): void { 
    this.router.navigate(['/update', 'addresses', addresses._id]); 
  } 
    deleteaddresses(addressesId: string): void { 
    console.log('Delete addresses ID:', addressesId); 
    this.service.deleteItem('addresses',addressesId).subscribe(  
       response => { 
           console.log('addresses deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['addresses'] = this.dataMap['addresses'].filter((addresses: any) => addresses._id !== addressesId); 
           alert('addresses Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting addresses:', error); 
           alert('Failed to delete addresses!'); 
       }  
    ); 
} 
} 
