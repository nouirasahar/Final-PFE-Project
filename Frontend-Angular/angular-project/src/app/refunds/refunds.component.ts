import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-refunds', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './refunds.component.html', 
  styleUrls: ['./refunds.component.scss'] 
} 
)  
export class refundsComponent implements OnInit {  
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
    viewrefunds(refunds: any): void { 
    console.log('View refunds:', refunds); 
    alert(`Viewing refunds: ${JSON.stringify(refunds, null, 2)}`); 
} 
    updaterefunds(refunds: any): void { 
    this.router.navigate(['/update', 'refunds', refunds._id]); 
  } 
    deleterefunds(refundsId: string): void { 
    console.log('Delete refunds ID:', refundsId); 
    this.service.deleteItem('refunds',refundsId).subscribe(  
       response => { 
           console.log('refunds deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['refunds'] = this.dataMap['refunds'].filter((refunds: any) => refunds._id !== refundsId); 
           alert('refunds Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting refunds:', error); 
           alert('Failed to delete refunds!'); 
       }  
    ); 
} 
} 
