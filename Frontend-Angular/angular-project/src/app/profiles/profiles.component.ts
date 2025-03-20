import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-profiles', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './profiles.component.html', 
  styleUrls: ['./profiles.component.scss'] 
} 
)  
export class profilesComponent implements OnInit {  
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
    viewprofiles(profiles: any): void { 
    console.log('View profiles:', profiles); 
    alert(`Viewing profiles: ${JSON.stringify(profiles, null, 2)}`); 
} 
    updateprofiles(profiles: any): void { 
    this.router.navigate(['/update', 'profiles', profiles._id]); 
  } 
    deleteprofiles(profilesId: string): void { 
    console.log('Delete profiles ID:', profilesId); 
    this.service.deleteItem('profiles',profilesId).subscribe(  
       response => { 
           console.log('profiles deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['profiles'] = this.dataMap['profiles'].filter((profiles: any) => profiles._id !== profilesId); 
           alert('profiles Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting profiles:', error); 
           alert('Failed to delete profiles!'); 
       }  
    ); 
} 
} 
