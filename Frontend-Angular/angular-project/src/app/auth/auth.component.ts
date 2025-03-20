import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-auth', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './auth.component.html', 
  styleUrls: ['./auth.component.scss'] 
} 
)  
export class authComponent implements OnInit {  
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
    viewauth(auth: any): void { 
    console.log('View auth:', auth); 
    alert(`Viewing auth: ${JSON.stringify(auth, null, 2)}`); 
} 
    updateauth(auth: any): void { 
    this.router.navigate(['/update', 'auth', auth._id]); 
  } 
    deleteauth(authId: string): void { 
    console.log('Delete auth ID:', authId); 
    this.service.deleteItem('auth',authId).subscribe(  
       response => { 
           console.log('auth deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['auth'] = this.dataMap['auth'].filter((auth: any) => auth._id !== authId); 
           alert('auth Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting auth:', error); 
           alert('Failed to delete auth!'); 
       }  
    ); 
} 
} 
