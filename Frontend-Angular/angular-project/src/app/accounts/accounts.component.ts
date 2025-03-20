import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-accounts', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './accounts.component.html', 
  styleUrls: ['./accounts.component.scss'] 
} 
)  
export class accountsComponent implements OnInit {  
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
    viewaccounts(accounts: any): void { 
    console.log('View accounts:', accounts); 
    alert(`Viewing accounts: ${JSON.stringify(accounts, null, 2)}`); 
} 
    updateaccounts(accounts: any): void { 
    this.router.navigate(['/update', 'accounts', accounts._id]); 
  } 
    deleteaccounts(accountsId: string): void { 
    console.log('Delete accounts ID:', accountsId); 
    this.service.deleteItem('accounts',accountsId).subscribe(  
       response => { 
           console.log('accounts deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['accounts'] = this.dataMap['accounts'].filter((accounts: any) => accounts._id !== accountsId); 
           alert('accounts Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting accounts:', error); 
           alert('Failed to delete accounts!'); 
       }  
    ); 
} 
} 
