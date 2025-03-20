import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
@Component({ 
  selector: 'app-groups', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './groups.component.html', 
  styleUrls: ['./groups.component.scss'] 
} 
)  
export class groupsComponent implements OnInit {  
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
    viewgroups(groups: any): void { 
    console.log('View groups:', groups); 
    alert(`Viewing groups: ${JSON.stringify(groups, null, 2)}`); 
} 
    updategroups(groups: any): void { 
    this.router.navigate(['/update', 'groups', groups._id]); 
  } 
    deletegroups(groupsId: string): void { 
    console.log('Delete groups ID:', groupsId); 
    this.service.deleteItem('groups',groupsId).subscribe(  
       response => { 
           console.log('groups deleted successfully', response); 
           // Mise à jour de l'affichage des données après suppression 
           this.dataMap['groups'] = this.dataMap['groups'].filter((groups: any) => groups._id !== groupsId); 
           alert('groups Deleted!'); 
       }, 
       error => { 
           console.error('Error deleting groups:', error); 
           alert('Failed to delete groups!'); 
       }  
    ); 
} 
} 
