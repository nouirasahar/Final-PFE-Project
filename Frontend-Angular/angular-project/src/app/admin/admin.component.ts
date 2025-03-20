import { Component, OnInit } from '@angular/core'; 
import { SharedService } from '../services/shared.service'; 
import { CommonModule } from '@angular/common';  
import { Router } from '@angular/router';  
@Component({  
  selector: 'app-admin',  
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './admin.component.html', 
  styleUrls: ['./admin.component.scss']  
}  
)  
export class AdminComponent implements OnInit {   
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
 // Redirection dynamique vers la route correspondante 
      viewTable(table: string): void {
        const route = `/${table.toLowerCase()}`; // Ex: "Students" => "/students"
        this.router.navigate([route]);
}
      updateTable(table: string): void {
        console.log('Update table:', table);
        alert(`Updating table: ${table}`);
}
      deleteTable(table: string): void {
        console.log('Delete table:', table);
        this.tables = this.tables.filter(t => t !== table);
        delete this.dataMap[table];
        alert(`Table ${table} deleted!`);
}
}
