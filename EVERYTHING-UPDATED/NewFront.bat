@echo off
echo ===== Setting up Angular Frontend =====

:: Enable delayed variable expansion for dynamic variables inside loops
setlocal enabledelayedexpansion

:: Define the Angular project folder
set projectDir=%~dp0angular-project
set projectName=angular-project

:: Fetch the JSON response from the API and save it to a temporary file
::1/define the api URL
set apiUrl=http://localhost:3000/api/tablenames 
::2/define a temporary json file to stock the data coming from the api
set jsonFile=%temp%\tablenames.json
::send a silent request to the defined api to fetch the data. By default, curl uses the GET method
curl -s %apiUrl% > "%jsonFile%"
::if curl couldn't fetch the data then we show the message and we "exit" 
if errorlevel 1 (
    echo Failed to retrieve data from the API!
    exit /b
)

:: Initialize the items list.This will contain the final table names 
set items=

:: Parse the JSON to extract table names
::delims = "delimiters (by default, space or tab)
for /f "delims=" %%i in ('findstr /r /c:"\".*\"" "%jsonFile%"') do (
    set name=%%i
    set name=!name:"=!
    :: Remove square brackets from the table name
    set name=!name:[=!
    set name=!name:]=!
    set name=!name:_=!
    set name=!name:-=!
    set name=!name:.=!
    set name=!name:'=!
    set name=!name:`=!
    set items=!items! !name!
)

:: Check if the list is empty
if "%items%"=="" (
    echo Failed to parse table names from the API!
    del "%jsonFile%"
    exit /b
)

:: Remove the temporary JSON file
del "%jsonFile%"

:: Create the Angular project if it doesn't exist
if not exist "%projectDir%" (
    echo Creating Angular project...
    ng new %projectName% --routing --style=scss --skip-install --defaults
    cd "%projectDir%"
    ::STYLE.SCSS
    echo body { > src\styles.scss
    echo background: #d9ecff ;>> src\styles.scss
    echo margin: 0;>> src\styles.scss
    echo padding: 0;>> src\styles.scss
    echo font-family: Arial, sans-serif;>> src\styles.scss
    echo }>> src\styles.scss
    :: Génération du fichier app.config.ts
    echo import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; > src\app\app.config.ts
    echo import { provideRouter } from '@angular/router'; >> src\app\app.config.ts
    echo import { routes } from './app.routes'; >> src\app\app.config.ts
    echo import { provideHttpClient } from '@angular/common/http'; >> src\app\app.config.ts
    echo export const appConfig: ApplicationConfig = { >> src\app\app.config.ts
    echo   providers: [ >> src\app\app.config.ts
    echo     provideZoneChangeDetection^({ eventCoalescing: true }^), >> src\app\app.config.ts
    echo     provideRouter^(routes^), >> src\app\app.config.ts
    echo     provideHttpClient^(^) >> src\app\app.config.ts
    echo   ] >> src\app\app.config.ts
    echo }; >> src\app\app.config.ts
    :: Génération du fichier app.routes.ts
    echo //app.routes > src\app\app.routes.ts
    echo import { Routes } from '@angular/router'; >> src\app\app.routes.ts
    echo import { AdminComponent } from './admin/admin.component'; >> src\app\app.routes.ts
    echo import { SidebarComponent } from './sidebar/sidebar.component'; >> src\app\app.routes.ts
    echo import { UpdateComponent } from './update/update.component'; >> src\app\app.routes.ts
    for %%i in (%items%) do (
        echo import { %%iComponent } from './%%i/%%i.component'; >> src\app\app.routes.ts)
    echo export const routes: Routes = [ >> src\app\app.routes.ts
        for %%i in (%items%) do (
            echo   { path: '%%i', component: %%iComponent }, >> src\app\app.routes.ts)
        echo { path: 'admin', component: AdminComponent }, >> src\app\app.routes.ts
        echo { path: 'sidebar', component: SidebarComponent}, >> src\app\app.routes.ts
        echo { path: 'update/:table/:id', component: UpdateComponent }, >> src\app\app.routes.ts
        echo { path: '', redirectTo: '/admin', pathMatch: 'full' } >> src\app\app.routes.ts
    echo ]; >> src\app\app.routes.ts
    ::creating app.component.html
    echo ^<div class="layout"^> > src\app\app.component.html
    echo    ^<app-sidebar^>^</app-sidebar^> >> src\app\app.component.html
    echo    ^<div class="content"^> >> src\app\app.component.html
    echo     ^<nav^> >> src\app\app.component.html
    echo      ^<a routerLink="/admin" routerLinkActive="active-link"^>^</a^> >> src\app\app.component.html
    for %%i in (%items%) do (
        echo   ^<a routerLink="/%%i"^>^</a^> >> src\app\app.component.html)
    echo       ^<!-- Search Bar --^> >> src\app\app.component.html
    echo     ^<input type="text" placeholder="🔍Search..." class="search-bar" /^> >> src\app\app.component.html
    echo     ^</nav^> >> src\app\app.component.html
    echo    ^<router-outlet^>^</router-outlet^>  >> src\app\app.component.html
    echo    ^</div^> >> src\app\app.component.html
    echo ^</div^> >> src\app\app.component.html
    ::creating app.component.ts
    echo import { Component } from '@angular/core'; > src\app\app.component.ts
    echo import { RouterOutlet } from '@angular/router'; >> src\app\app.component.ts
    echo import { AdminComponent } from './admin/admin.component'; >> src\app\app.component.ts
    echo import { SidebarComponent } from './sidebar/sidebar.component'; >> src\app\app.component.ts
        for %%i in (%items%) do (
    echo import { %%iComponent } from './%%i/%%i.component'; >> src\app\app.component.ts
)
    echo @Component^({ >> src\app\app.component.ts
    echo     selector: 'app-root', >>src\app\app.component.ts
    echo     standalone: true, >>src\app\app.component.ts
    echo     imports:[ >>src\app\app.component.ts
            for %%i in (%items%) do (
    echo     %%iComponent, >> src\app\app.component.ts
)
    echo     AdminComponent, >> src\app\app.component.ts
    echo     SidebarComponent, >> src\app\app.component.ts
    echo     RouterOutlet >> src\app\app.component.ts
    echo   ], >> src\app\app.component.ts
    echo   templateUrl: './app.component.html', >> src\app\app.component.ts
    echo   styleUrls: ['./app.component.scss'] >> src\app\app.component.ts
    echo  }^) >> src\app\app.component.ts
    echo export class AppComponent { >> src\app\app.component.ts
    echo   title = 'user-test'; >> src\app\app.component.ts
    echo } >> src\app\app.component.ts
    if errorlevel 1 (
        echo Failed to create Angular project!
        exit /b
    )
    ::creating app.component.scss
    echo /* General Layout */  > src\app\app.component.scss
    echo .layout { >> src\app\app.component.scss
    echo     display: flex; >> src\app\app.component.scss
    echo     height: 100vh; >> src\app\app.component.scss
    echo     margin: 0; >> src\app\app.component.scss
    echo     padding: 0; >> src\app\app.component.scss
    echo     background-color: #d9ecff; >> src\app\app.component.scss
    echo     .content { >> src\app\app.component.scss
    echo         flex: 1; >> src\app\app.component.scss
    echo         margin-left: 200px; >> src\app\app.component.scss
    echo         padding: 30px; >> src\app\app.component.scss
    echo     } >> src\app\app.component.scss
    echo     .search-bar {>> src\app\app.component.scss
    echo         padding: 8px 16px;>> src\app\app.component.scss
    echo         margin-left: auto;>> src\app\app.component.scss
    echo         border-radius: 50px;>> src\app\app.component.scss
    echo         border: 1px solid #ccc;>> src\app\app.component.scss
    echo         font-size: 14px;>> src\app\app.component.scss
    echo         width: 220px;>> src\app\app.component.scss
    echo         outline: none;>> src\app\app.component.scss
    echo         background-color: #fff;>> src\app\app.component.scss
    echo         box-shadow: 0 2px 4px rgba^(0,0,0,0.1^);>> src\app\app.component.scss
    echo         }>> src\app\app.component.scss
    echo } >> src\app\app.component.scss
    echo @media ^(max-width: 768px^) { >> src\app\app.component.scss
    echo     .layout { >> src\app\app.component.scss
    echo         flex-direction: column; >> src\app\app.component.scss
    echo         .sidebar { >> src\app\app.component.scss
    echo             position: relative; >> src\app\app.component.scss
    echo             width: 100%%; >> src\app\app.component.scss
    echo             flex-direction: row; >> src\app\app.component.scss
    echo             padding: 10px; >> src\app\app.component.scss
    echo             h2 { font-size: 18px; margin: 0 10px 0 0; } >> src\app\app.component.scss
    echo             nav ul { display: flex; justify-content: space-around; flex: 1; li { margin: 0; } } >> src\app\app.component.scss
    echo         } >> src\app\app.component.scss
    echo         .content { >> src\app\app.component.scss
    echo             margin : 0; >> src\app\app.component.scss
    echo             padding: 10px; >> src\app\app.component.scss
    echo             .top-nav { flex-wrap: wrap; a { margin: 5px; font-size: 14px; } } >> src\app\app.component.scss
    echo         } >> src\app\app.component.scss
    echo     } >> src\app\app.component.scss
    echo } >> src\app\app.component.scss
    echo @media ^(max-width: 480px^) { >> src\app\app.component.scss
    echo     .layout { >> src\app\app.component.scss
    echo         .sidebar { display: none; }  /* hide sidebar entirely */ >> src\app\app.component.scss
    echo         .content { >> src\app\app.component.scss
    echo             margin: 0; >> src\app\app.component.scss
    echo             .top-nav { >> src\app\app.component.scss
    echo                 justify-content: center; >> src\app\app.component.scss
    echo                 a { flex: 1 0 45%%; text-align: center; padding: 8px; font-size: 13px; } >> src\app\app.component.scss
    echo             } >> src\app\app.component.scss
    echo         } >> src\app\app.component.scss
    echo     } >> src\app\app.component.scss
    echo } >> src\app\app.component.scss

    echo Angular project "%projectName%" created successfully.
    cd "%projectDir%"
    
    :: Generate components based on the list
    echo ===== Generating components based on the list =====
    ng g c sidebar
    ng g c admin
    ng g c update
    ::creating admin.component.html
    echo ^<div class="admin-dashboard"^> >src\app\admin\admin.component.html
    echo ^<p^>⚙️Admin Dashboard^</p^> >>src\app\admin\admin.component.html
    echo ^<table border="1"^>  >>src\app\admin\admin.component.html
    echo   ^<thead^> >>src\app\admin\admin.component.html
    echo     ^<tr^> >>src\app\admin\admin.component.html
    echo       ^<th^>Table Name^</th^> >>src\app\admin\admin.component.html
    echo       ^<th^>Actions^</th^> >>src\app\admin\admin.component.html
    echo     ^</tr^> >>src\app\admin\admin.component.html
    echo   ^</thead^> >>src\app\admin\admin.component.html
    echo   ^<tbody^> >>src\app\admin\admin.component.html
    echo     ^<tr *ngFor="let table of tables"^> >>src\app\admin\admin.component.html
    echo       ^<td^>{{ table }}^</td^> >>src\app\admin\admin.component.html
    echo       ^<td^> >>src\app\admin\admin.component.html
    echo         ^<button ^(click^)="viewTable(table)" class="btn"^> >>src\app\admin\admin.component.html
    echo           ^<i class="fas fa-eye"^>^</i^> View >>src\app\admin\admin.component.html
    echo         ^</button^> >>src\app\admin\admin.component.html
    echo         ^<button ^(click^)="deleteTable(table)" class="btn"^> >>src\app\admin\admin.component.html
    echo           ^<i class="fas fa-trash-alt"^>^</i^> Delete >>src\app\admin\admin.component.html
    echo         ^</button^> >>src\app\admin\admin.component.html
    echo       ^</td^> >>src\app\admin\admin.component.html
    echo     ^</tr^> >>src\app\admin\admin.component.html
    echo   ^</tbody^> >>src\app\admin\admin.component.html
    echo ^</table^> >>src\app\admin\admin.component.html
    echo ^</div^>
    ::creating admin.scss
    echo  /* admin styling*/ >src\app\admin\admin.component.Scss
    echo .admin-dashboard { >>src\app\admin\admin.component.scss
    echo   background: #edf6ff; >>src\app\admin\admin.component.scss
    echo   margin: 20px auto; >>src\app\admin\admin.component.scss
    echo   max-width: 80%%; >>src\app\admin\admin.component.scss
    echo   padding: 30px; >>src\app\admin\admin.component.scss
    echo   border-radius: 19px; >>src\app\admin\admin.component.scss
    echo   box-shadow: 0 4px 8px rgba^(0,0,0,0.1^); >>src\app\admin\admin.component.scss
    echo   p { >>src\app\admin\admin.component.scss
    echo     text-align: center; >>src\app\admin\admin.component.scss
    echo     font: bold 28px Arial, sans-serif; >>src\app\admin\admin.component.scss
    echo     margin-bottom: 20px; >>src\app\admin\admin.component.scss
    echo     color: #34495e; >>src\app\admin\admin.component.scss
    echo   } >>src\app\admin\admin.component.scss
    echo   table { >>src\app\admin\admin.component.scss
    echo     width: 100%%; >>src\app\admin\admin.component.scss
    echo     margin-top: 10px; >>src\app\admin\admin.component.scss
    echo     border-collapse: collapse; >>src\app\admin\admin.component.scss
    echo     border-radius: 8px; >>src\app\admin\admin.component.scss
    echo     overflow: hidden; >>src\app\admin\admin.component.scss
    echo     box-shadow: 0 2px 4px rgba^(0,0,0,0.1^); >>src\app\admin\admin.component.scss
    echo     thead { >>src\app\admin\admin.component.scss
    echo       background: #014e85; >>src\app\admin\admin.component.scss
    echo       color: #fff; >>src\app\admin\admin.component.scss
    echo       th { >>src\app\admin\admin.component.scss
    echo         padding: 12px 16px; >>src\app\admin\admin.component.scss
    echo         font-size: 16px; >>src\app\admin\admin.component.scss
    echo         ^&:nth-child^(2^) { text-align: center; } >>src\app\admin\admin.component.scss
    echo       } >>src\app\admin\admin.component.scss
    echo     } >>src\app\admin\admin.component.scss
    echo     tbody { >>src\app\admin\admin.component.scss
    echo       tr { >>src\app\admin\admin.component.scss
    echo         transition: background .2s; >>src\app\admin\admin.component.scss
    echo         ^&:nth-child^(even^) { background: #f9f9f9; } >>src\app\admin\admin.component.scss
    echo         ^&:hover { background: #eaf2f8; } >>src\app\admin\admin.component.scss
    echo         td { >>src\app\admin\admin.component.scss
    echo           padding: 12px 16px; >>src\app\admin\admin.component.scss
    echo           font-size: 14px; >>src\app\admin\admin.component.scss
    echo           border-bottom: 1px solid #ddd; >>src\app\admin\admin.component.scss
    echo           ^&:nth-child^(2^) { text-align: center; } >>src\app\admin\admin.component.scss
    echo         } >>src\app\admin\admin.component.scss
    echo       } >>src\app\admin\admin.component.scss
    echo     } >>src\app\admin\admin.component.scss
    echo   } >>src\app\admin\admin.component.scss
    echo   .btn { >>src\app\admin\admin.component.scss
    echo     background: #d6eaff; >>src\app\admin\admin.component.scss
    echo     color: #34495e; >>src\app\admin\admin.component.scss
    echo     border: 1px solid #a9d5ff; >>src\app\admin\admin.component.scss
    echo     padding: 7px 55px; >>src\app\admin\admin.component.scss
    echo     font-size: 14px; >>src\app\admin\admin.component.scss
    echo     border-radius: 6px; >>src\app\admin\admin.component.scss
    echo     cursor: pointer; >>src\app\admin\admin.component.scss
    echo     transition: .3s; >>src\app\admin\admin.component.scss
    echo     margin: 0 6px; >>src\app\admin\admin.component.scss
    echo     display: inline-flex; >>src\app\admin\admin.component.scss
    echo     align-items: center; >>src\app\admin\admin.component.scss
    echo     justify-content: center; >>src\app\admin\admin.component.scss
    echo     gap: 6px; >>src\app\admin\admin.component.scss
    echo     i { font-size: 16px; } >>src\app\admin\admin.component.scss
    echo     ^&:hover { >>src\app\admin\admin.component.scss
    echo       background: #b8d8ff; >>src\app\admin\admin.component.scss
    echo       transform: translateY^(-2px^); >>src\app\admin\admin.component.scss
    echo       box-shadow: 0 2px 4px rgba^(0,0,0,0.1^); >>src\app\admin\admin.component.scss
    echo     } >>src\app\admin\admin.component.scss
    echo     ^& ^+ ^& { margin-left: 12px; } >>src\app\admin\admin.component.scss
    echo   } >>src\app\admin\admin.component.scss
    echo   @media ^(max-width: 768px^) { >>src\app\admin\admin.component.scss
    echo     padding: 10px; >>src\app\admin\admin.component.scss
    echo     margin: 10px; >>src\app\admin\admin.component.scss
    echo     p { font-size: 24px; } >>src\app\admin\admin.component.scss
    echo     table { >>src\app\admin\admin.component.scss
    echo       thead th, tbody td { >>src\app\admin\admin.component.scss
    echo         padding: 8px 10px; >>src\app\admin\admin.component.scss
    echo         font-size: 13px; >>src\app\admin\admin.component.scss
    echo       } >>src\app\admin\admin.component.scss
    echo     } >>src\app\admin\admin.component.scss
    echo     .btn { >>src\app\admin\admin.component.scss
    echo       display: block; >>src\app\admin\admin.component.scss
    echo       width: 100%%; >>src\app\admin\admin.component.scss
    echo       margin: 5px 0; >>src\app\admin\admin.component.scss
    echo     } >>src\app\admin\admin.component.scss
    echo   } >>src\app\admin\admin.component.scss
    echo } >>src\app\admin\admin.component.scss

    ::creating admin component.ts
    echo import { Component, OnInit } from '@angular/core'; >src\app\admin\admin.component.ts
    echo import { SharedService } from '../services/shared.service'; >>src\app\admin\admin.component.ts
    echo import { CommonModule } from '@angular/common';  >>src\app\admin\admin.component.ts
    echo import { Router } from '@angular/router';  >>src\app\admin\admin.component.ts
    echo @Component({  >>src\app\admin\admin.component.ts
    echo   selector: 'app-admin',  >>src\app\admin\admin.component.ts
    echo   standalone: true, >>src\app\admin\admin.component.ts
    echo   imports: [CommonModule], >>src\app\admin\admin.component.ts
    echo   templateUrl: './admin.component.html', >>src\app\admin\admin.component.ts
    echo   styleUrls: ['./admin.component.scss']  >>src\app\admin\admin.component.ts
    echo }  >>src\app\admin\admin.component.ts
    echo ^) >>src\app\admin\admin.component.ts 
    echo export class AdminComponent implements OnInit {  >>src\app\admin\admin.component.ts 
    echo   tables: string[] = []; >>src\app\admin\admin.component.ts
    echo   dataMap: any = {};  >>src\app\admin\admin.component.ts
    echo   constructor^(private service: SharedService, private router: Router^) {}  >>src\app\admin\admin.component.ts
    echo   ngOnInit^(^): void {  >>src\app\admin\admin.component.ts
    echo       this.service.getUsers^(^).subscribe^(data =^> { >>src\app\admin\admin.component.ts 
    echo       console.log^("Données reçues:", data ^); >>src\app\admin\admin.component.ts 
    echo       if ^(data ^&^& typeof data === "object"^) { >>src\app\admin\admin.component.ts 
    echo         this.tables = Object.keys^(data^); >>src\app\admin\admin.component.ts 
    echo         this.dataMap = data; >>src\app\admin\admin.component.ts 
    echo         } else { >>src\app\admin\admin.component.ts 
    echo           this.tables = [];  >>src\app\admin\admin.component.ts 
    echo           this.dataMap = {};  >>src\app\admin\admin.component.ts 
    echo         } >>src\app\admin\admin.component.ts  
    echo       } >>src\app\admin\admin.component.ts  
    echo       ^); >>src\app\admin\admin.component.ts  
    echo     } >>src\app\admin\admin.component.ts 
    echo  // Redirection dynamique vers la route correspondante >>src\app\admin\admin.component.ts
    echo       viewTable^(table: string^): void {>>src\app\admin\admin.component.ts
    echo         const route = `/${table.toLowerCase^(^)}`; // Ex: "Students" =^> "/students">>src\app\admin\admin.component.ts
    echo         this.router.navigate^([route]^);>>src\app\admin\admin.component.ts
    echo }>>src\app\admin\admin.component.ts
    
    echo deleteTable^(table: string^): void {>>src\app\admin\admin.component.ts
    echo  if ^(confirm^(`Es-tu sûr de vouloir supprimer '${table}' ?`^)^) { >>src\app\admin\admin.component.ts
    echo    this.service.deleteTable^(table^).subscribe^(>>src\app\admin\admin.component.ts
    echo     ^(response^) =^> {>>src\app\admin\admin.component.ts
    echo       console.log^('Table supprimée:', response^); >>src\app\admin\admin.component.ts
    echo       this.tables = this.tables.filter^(t =^> t !== table^); >>src\app\admin\admin.component.ts
    echo       delete this.dataMap[table]; >>src\app\admin\admin.component.ts
    echo       alert^(`Table ${table} supprimée avec succès !`^); >>src\app\admin\admin.component.ts
    echo      }, >>src\app\admin\admin.component.ts
    echo      ^(error^) =^> { >>src\app\admin\admin.component.ts
    echo        console.error^('Erreur lors de la suppression de la table:', error^); >>src\app\admin\admin.component.ts
    echo        alert^(`Erreur lors de la suppression de la table '${table}'`^); >>src\app\admin\admin.component.ts
    echo      } >>src\app\admin\admin.component.ts
    echo    ^); >>src\app\admin\admin.component.ts
    echo  }>>src\app\admin\admin.component.ts
    echo }>>src\app\admin\admin.component.ts
    echo }>>src\app\admin\admin.component.ts
    :: creating sidebar.component.html
    echo ^<div^ class="sidebar"^> >src\app\sidebar\sidebar.component.html 
    echo ^<h2^>Admin Panel^</h2^> >>src\app\sidebar\sidebar.component.html
    echo ^<nav^> >>src\app\sidebar\sidebar.component.html
    echo ^<ul^> >>src\app\sidebar\sidebar.component.html
    echo   ^<li^>^<button^ ^(click^)="navigateToDashboard()" class="nav-button"^>🛠️Dashboard^</button^>^</li^> >>src\app\sidebar\sidebar.component.html
    echo ^</ul^> >>src\app\sidebar\sidebar.component.html
    echo ^</nav^> >>src\app\sidebar\sidebar.component.html
    echo ^</div^> >>src\app\sidebar\sidebar.component.html
    :: creating sidebar.component.scss
    echo /* Sidebar Styling */ >src\app\sidebar\sidebar.component.scss
    echo .sidebar { >> src\app\sidebar\sidebar.component.scss
    echo     width: 200px; >> src\app\sidebar\sidebar.component.scss
    echo     height: 100vh; >> src\app\sidebar\sidebar.component.scss
    echo     background: #014e85; >> src\app\sidebar\sidebar.component.scss
    echo     color: #ecf0f1; >> src\app\sidebar\sidebar.component.scss
    echo     position: fixed; >> src\app\sidebar\sidebar.component.scss
    echo     top: 0; >> src\app\sidebar\sidebar.component.scss
    echo     left: 0; >> src\app\sidebar\sidebar.component.scss
    echo     display: flex; >> src\app\sidebar\sidebar.component.scss
    echo     flex-direction: column; >> src\app\sidebar\sidebar.component.scss
    echo     align-items: center; >> src\app\sidebar\sidebar.component.scss
    echo     padding: 16px 0; >> src\app\sidebar\sidebar.component.scss
    echo     box-shadow: 2px 0 8px rgba^(0, 0, 0, 0.25^); >> src\app\sidebar\sidebar.component.scss
    echo     h2 { >> src\app\sidebar\sidebar.component.scss
    echo         font-size: 18px; >> src\app\sidebar\sidebar.component.scss
    echo         margin: 0 0 16px; >> src\app\sidebar\sidebar.component.scss
    echo         text-transform: uppercase; >> src\app\sidebar\sidebar.component.scss
    echo         letter-spacing: 0.5px; >> src\app\sidebar\sidebar.component.scss
    echo     } >> src\app\sidebar\sidebar.component.scss
    echo     nav ul { >> src\app\sidebar\sidebar.component.scss
    echo         list-style: none; >> src\app\sidebar\sidebar.component.scss
    echo         padding: 0; >> src\app\sidebar\sidebar.component.scss
    echo         width: 100%%; >> src\app\sidebar\sidebar.component.scss
    echo         display: flex; >> src\app\sidebar\sidebar.component.scss
    echo         flex-direction: column; >> src\app\sidebar\sidebar.component.scss
    echo         li { >> src\app\sidebar\sidebar.component.scss
    echo             margin: 10px 0; >> src\app\sidebar\sidebar.component.scss
    echo             a { >> src\app\sidebar\sidebar.component.scss
    echo                 display: block; >> src\app\sidebar\sidebar.component.scss
    echo                 padding: 8px 14px; >> src\app\sidebar\sidebar.component.scss
    echo                 text-decoration: none; >> src\app\sidebar\sidebar.component.scss
    echo                 color: inherit; >> src\app\sidebar\sidebar.component.scss
    echo                 font-size: 14px; >> src\app\sidebar\sidebar.component.scss
    echo                 border-radius: 6px; >> src\app\sidebar\sidebar.component.scss
    echo                 transition: background 0.3s; >> src\app\sidebar\sidebar.component.scss
    echo                 ^&:hover, ^&.active-link { background: #1a4d75; } >> src\app\sidebar\sidebar.component.scss
    echo             } >> src\app\sidebar\sidebar.component.scss
    echo             .nav-button { >> src\app\sidebar\sidebar.component.scss
    echo                 display: block; >> src\app\sidebar\sidebar.component.scss
    echo                 padding: 8px 14px; >> src\app\sidebar\sidebar.component.scss
    echo                 background: #fff; >> src\app\sidebar\sidebar.component.scss
    echo                 color: #014e85; >> src\app\sidebar\sidebar.component.scss
    echo                 border: none; >> src\app\sidebar\sidebar.component.scss
    echo                 border-radius: 30px; >> src\app\sidebar\sidebar.component.scss
    echo                 font-size: 14px; >> src\app\sidebar\sidebar.component.scss
    echo                 cursor: pointer; >> src\app\sidebar\sidebar.component.scss
    echo                 width: 100%%; >> src\app\sidebar\sidebar.component.scss
    echo                 text-align: left; >> src\app\sidebar\sidebar.component.scss
    echo                 box-shadow: 0 2px 5px rgba^(0, 0, 0, 0.15^); >> src\app\sidebar\sidebar.component.scss
    echo                 transition: 0.3s; >> src\app\sidebar\sidebar.component.scss
    echo                 ^&:hover { >> src\app\sidebar\sidebar.component.scss
    echo                     background: #ecf0f1; >> src\app\sidebar\sidebar.component.scss
    echo                     box-shadow: 0 4px 8px rgba^(0, 0, 0, 0.2^); >> src\app\sidebar\sidebar.component.scss
    echo                 } >> src\app\sidebar\sidebar.component.scss
    echo             } >> src\app\sidebar\sidebar.component.scss
    echo         } >> src\app\sidebar\sidebar.component.scss
    echo     } >> src\app\sidebar\sidebar.component.scss
    echo } >> src\app\sidebar\sidebar.component.scss
    echo @media ^(max-width: 768px^) { >> src\app\sidebar\sidebar.component.scss
    echo     .sidebar { >> src\app\sidebar\sidebar.component.scss
    echo         width: 100%%; >> src\app\sidebar\sidebar.component.scss
    echo         height: auto; >> src\app\sidebar\sidebar.component.scss
    echo         position: relative; >> src\app\sidebar\sidebar.component.scss
    echo         flex-direction: row; >> src\app\sidebar\sidebar.component.scss
    echo         padding: 10px; >> src\app\sidebar\sidebar.component.scss
    echo         h2 { font-size: 16px; margin: 0 12px 0 0; } >> src\app\sidebar\sidebar.component.scss
    echo         nav ul { >> src\app\sidebar\sidebar.component.scss
    echo             flex-direction: row; >> src\app\sidebar\sidebar.component.scss
    echo             justify-content: space-around; >> src\app\sidebar\sidebar.component.scss
    echo             li { >> src\app\sidebar\sidebar.component.scss
    echo                 margin: 0; >> src\app\sidebar\sidebar.component.scss
    echo                 a { >> src\app\sidebar\sidebar.component.scss
    echo                     padding: 8px 10px; >> src\app\sidebar\sidebar.component.scss
    echo                     font-size: 13px; >> src\app\sidebar\sidebar.component.scss
    echo                 } >> src\app\sidebar\sidebar.component.scss
    echo                 .nav-button { >> src\app\sidebar\sidebar.component.scss
    echo                     padding: 8px 10px; >> src\app\sidebar\sidebar.component.scss
    echo                     font-size: 13px; >> src\app\sidebar\sidebar.component.scss
    echo                     border-radius: 20px; >> src\app\sidebar\sidebar.component.scss
    echo                 } >> src\app\sidebar\sidebar.component.scss
    echo             } >> src\app\sidebar\sidebar.component.scss
    echo         } >> src\app\sidebar\sidebar.component.scss
    echo     } >> src\app\sidebar\sidebar.component.scss
    echo } >> src\app\sidebar\sidebar.component.scss
    echo @media ^(max-width: 480px^) { >> src\app\sidebar\sidebar.component.scss
    echo     .sidebar { >> src\app\sidebar\sidebar.component.scss
    echo         flex-wrap: wrap; >> src\app\sidebar\sidebar.component.scss
    echo         padding: 8px; >> src\app\sidebar\sidebar.component.scss
    echo         h2 { display: none; } >> src\app\sidebar\sidebar.component.scss
    echo         nav ul { >> src\app\sidebar\sidebar.component.scss
    echo             flex-wrap: wrap; >> src\app\sidebar\sidebar.component.scss
    echo             li { >> src\app\sidebar\sidebar.component.scss
    echo                 flex: 1 0 50%%; >> src\app\sidebar\sidebar.component.scss
    echo                 a { padding: 6px; font-size: 12px; } >> src\app\sidebar\sidebar.component.scss
    echo                 .nav-button { >> src\app\sidebar\sidebar.component.scss
    echo                     padding: 6px; >> src\app\sidebar\sidebar.component.scss
    echo                     font-size: 12px; >> src\app\sidebar\sidebar.component.scss
    echo                     border-radius: 20px; >> src\app\sidebar\sidebar.component.scss
    echo                 } >> src\app\sidebar\sidebar.component.scss
    echo             } >> src\app\sidebar\sidebar.component.scss
    echo         } >> src\app\sidebar\sidebar.component.scss
    echo     } >> src\app\sidebar\sidebar.component.scss
    echo } >> src\app\sidebar\sidebar.component.scss

    ::Creating sidebar.component.ts
    echo import { CommonModule } from '@angular/common'; >src\app\sidebar\sidebar.component.ts
    echo import { Component } from '@angular/core'; >>src\app\sidebar\sidebar.component.ts
    echo import { Router } from '@angular/router'; >>src\app\sidebar\sidebar.component.ts
    echo @Component^({  >>src\app\sidebar\sidebar.component.ts
    echo selector: 'app-sidebar', >>src\app\sidebar\sidebar.component.ts
    echo standalone: true, >>src\app\sidebar\sidebar.component.ts
    echo imports: [CommonModule], >>src\app\sidebar\sidebar.component.ts
    echo templateUrl: './sidebar.component.html', >>src\app\sidebar\sidebar.component.ts
    echo styleUrl: './sidebar.component.scss' >>src\app\sidebar\sidebar.component.ts
    echo }^) >>src\app\sidebar\sidebar.component.ts
    echo export class SidebarComponent { >>src\app\sidebar\sidebar.component.ts
    echo constructor^(private router: Router^) {} >>src\app\sidebar\sidebar.component.ts
    echo navigateToDashboard^(^) { >>src\app\sidebar\sidebar.component.ts
    echo this.router.navigate^(['/admin']^); >>src\app\sidebar\sidebar.component.ts
    echo } >>src\app\sidebar\sidebar.component.ts
    echo } >>src\app\sidebar\sidebar.component.ts

    for %%i in (%items%) do (
        echo Generating component %%i
        ng g c %%i --standalone
        :: Generate components ts
        echo import { Component, OnInit } from '@angular/core'; > src\app\%%i\%%i.component.ts
        echo import { SharedService } from '../services/shared.service'; >> src\app\%%i\%%i.component.ts
        echo import { CommonModule } from '@angular/common'; >> src\app\%%i\%%i.component.ts
        echo import { Router } from '@angular/router'; >> src\app\%%i\%%i.component.ts
        echo @Component({ >> src\app\%%i\%%i.component.ts
        echo   selector: 'app-%%i', >> src\app\%%i\%%i.component.ts
        echo   standalone: true, >> src\app\%%i\%%i.component.ts
        echo   imports: [CommonModule], >> src\app\%%i\%%i.component.ts
        echo   templateUrl: './%%i.component.html', >> src\app\%%i\%%i.component.ts
        echo   styleUrls: ['./%%i.component.scss'] >> src\app\%%i\%%i.component.ts
        echo } >> src\app\%%i\%%i.component.ts
        echo ^) >> src\app\%%i\%%i.component.ts 
        echo export class %%iComponent implements OnInit { >> src\app\%%i\%%i.component.ts 
        echo   tables: string[] = []; >> src\app\%%i\%%i.component.ts
        echo   dataMap: any = {}; >> src\app\%%i\%%i.component.ts
        echo   constructor^(private service: SharedService, private router: Router^) {} >> src\app\%%i\%%i.component.ts
        echo   ngOnInit^(^): void { >> src\app\%%i\%%i.component.ts
        echo       this.service.getUsers^(^).subscribe(data =^> { >> src\app\%%i\%%i.component.ts
        echo       console.log^("Données reçues:", data ^); >> src\app\%%i\%%i.component.ts
        echo       if ^(data ^&^& typeof data === "object"^) { >> src\app\%%i\%%i.component.ts
        echo         this.tables = Object.keys^(data^); >> src\app\%%i\%%i.component.ts
        echo         this.dataMap = data; >> src\app\%%i\%%i.component.ts
        echo         } else { >> src\app\%%i\%%i.component.ts
        echo           this.tables = [];  >> src\app\%%i\%%i.component.ts
        echo           this.dataMap = {};  >> src\app\%%i\%%i.component.ts 
        echo         } >> src\app\%%i\%%i.component.ts 
        echo       } >> src\app\%%i\%%i.component.ts 
        echo       ^); >> src\app\%%i\%%i.component.ts 
        echo     } >> src\app\%%i\%%i.component.ts 
        echo //get columns for the table dynamically >> src\app\%%i\%%i.component.ts 
        echo     getColumns^(table: string^): string[] { >> src\app\%%i\%%i.component.ts
        echo         return this.dataMap[table] ^&^& this.dataMap[table].length ^> 0  >> src\app\%%i\%%i.component.ts
        echo           ? Object.keys^(this.dataMap[table][0]^) : []; >> src\app\%%i\%%i.component.ts
        echo     } >> src\app\%%i\%%i.component.ts

        echo  // Get the values of a row dynamically  >> src\app\%%i\%%i.component.ts
        echo     getValues^(row: any^): any[] {  >> src\app\%%i\%%i.component.ts
        echo       return Object.values^(row^);  >> src\app\%%i\%%i.component.ts
        echo   }  >> src\app\%%i\%%i.component.ts
        echo // New Methods for the Buttons >> src\app\%%i\%%i.component.ts
        echo     view%%i^(^%%i: any^)^: void { >> src\app\%%i\%%i.component.ts
        echo     console.log^(^'View %%i:', %%i^)^; >> src\app\%%i\%%i.component.ts
        echo     alert^(`Viewing %%i: ${JSON.stringify^(%%i, null, 2^)}`^); >> src\app\%%i\%%i.component.ts
        echo } >> src\app\%%i\%%i.component.ts

        echo     update%%i^(%%i: any^): void { >> src\app\%%i\%%i.component.ts
        echo     this.router.navigate^(['/update', '%%i', %%i._id]^); >> src\app\%%i\%%i.component.ts
        echo   } >> src\app\%%i\%%i.component.ts

        echo     delete%%i^(%%iId: string^): void { >> src\app\%%i\%%i.component.ts
        echo     console.log^('Delete %%i ID:', %%iId^); >> src\app\%%i\%%i.component.ts
        echo     this.service.deleteItem^('%%i',%%iId^).subscribe^(  >> src\app\%%i\%%i.component.ts
        echo        response =^> { >> src\app\%%i\%%i.component.ts
        echo            console.log^('%%i deleted successfully', response^); >> src\app\%%i\%%i.component.ts
        echo            // Mise à jour de l'affichage des données après suppression >> src\app\%%i\%%i.component.ts
        echo            this.dataMap['%%i'] = this.dataMap['%%i'].filter^(^(%%i: any^) =^> %%i._id !== %%iId^); >> src\app\%%i\%%i.component.ts
        echo            alert^('%%i Deleted!'^); >> src\app\%%i\%%i.component.ts
        echo        }, >> src\app\%%i\%%i.component.ts
        echo        error =^> { >> src\app\%%i\%%i.component.ts
        echo            console.error^('Error deleting %%i:', error^); >> src\app\%%i\%%i.component.ts
        echo            alert^('Failed to delete %%i!'^); >> src\app\%%i\%%i.component.ts
        echo        }  >> src\app\%%i\%%i.component.ts
        echo     ^); >> src\app\%%i\%%i.component.ts
        echo } >> src\app\%%i\%%i.component.ts
        echo } >> src\app\%%i\%%i.component.ts
        :: Generate components html
        echo ^<p^>%%i Table:^</p^>  > src\app\%%i\%%i.component.html 
        echo ^<div^ *ngIf="tables.length > 0" ^> >> src\app\%%i\%%i.component.html
        echo ^<div^ *ngFor="let table of tables" ^> >> src\app\%%i\%%i.component.html
        echo ^<table^ border="1" *ngIf="table === '%%i'"^> >> src\app\%%i\%%i.component.html
        echo ^<thead^ ^> >> src\app\%%i\%%i.component.html
        echo ^<tr^> >> src\app\%%i\%%i.component.html
        echo ^<th^ *ngFor="let column of getColumns(table)"^>{{ column }}^</th^> >> src\app\%%i\%%i.component.html
        echo ^<th^>Actions^</th^> >> src\app\%%i\%%i.component.html
        echo ^</tr^>
        echo ^</thead^> >> src\app\%%i\%%i.component.html
        echo ^<tbody^> >> src\app\%%i\%%i.component.html
        echo ^<tr^ *ngFor="let row of dataMap[table]" ^> >> src\app\%%i\%%i.component.html
        echo ^<td^ *ngFor="let column of getColumns(table)" ^>{{ row[column] }}^</td^> >> src\app\%%i\%%i.component.html
        echo ^<td^>  >> src\app\%%i\%%i.component.html
        echo    ^<button ^(click^)="view%%i(row)"class="btn"^>^<i class="fas fa-eye"^>^</i^>View^</button^>  >> src\app\%%i\%%i.component.html
        echo    ^<button ^(click^)="update%%i(row)"class="btn"^>^<i class="fas fa-pencil-alt"^>^</i^>Update^</button^>  >> src\app\%%i\%%i.component.html
        echo    ^<button ^(click^)="delete%%i(row._id)"class="btn"^>^<i class="fas fa-trash-alt"^>^</i^>delete^</button^>  >> src\app\%%i\%%i.component.html
        echo ^</td^>  >> src\app\%%i\%%i.component.html
        echo ^</tr^> >> src\app\%%i\%%i.component.html
        echo ^</tbody^> >> src\app\%%i\%%i.component.html
        echo ^</table^> >> src\app\%%i\%%i.component.html
        echo ^</div^> >> src\app\%%i\%%i.component.html
        echo ^</div^> >> src\app\%%i\%%i.component.html
        ::create component.Scss
        echo table { >> src\app\%%i\%%i.component.scss
        echo   width: 100%%; >> src\app\%%i\%%i.component.scss
        echo   border-collapse: collapse; >> src\app\%%i\%%i.component.scss
        echo   min-width: 500px; >> src\app\%%i\%%i.component.scss
        echo   table-layout: auto; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo th, td { >> src\app\%%i\%%i.component.scss
        echo   padding: 8px; >> src\app\%%i\%%i.component.scss
        echo   text-align: center; >> src\app\%%i\%%i.component.scss
        echo   font-size: 12px; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo thead { >> src\app\%%i\%%i.component.scss
        echo   background: #014e85; >> src\app\%%i\%%i.component.scss
        echo   color: #fff; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo tbody tr:nth-child^(odd^) { >> src\app\%%i\%%i.component.scss
        echo   background: #f9f9f9; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo tbody tr:nth-child^(even^) { >> src\app\%%i\%%i.component.scss
        echo   background: #f4f7fa; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo tbody tr:hover { >> src\app\%%i\%%i.component.scss
        echo   background: #eaf2f8; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo .btn { >> src\app\%%i\%%i.component.scss
        echo   padding: 8px 12px; >> src\app\%%i\%%i.component.scss
        echo   font-size: 14px; >> src\app\%%i\%%i.component.scss
        echo   background: #d6eaff; >> src\app\%%i\%%i.component.scss
        echo   border: 1px solid #a9d5ff; >> src\app\%%i\%%i.component.scss
        echo   border-radius: 5px; >> src\app\%%i\%%i.component.scss
        echo   cursor: pointer; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo .btn:hover { >> src\app\%%i\%%i.component.scss
        echo   background: #b8d8ff; >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo @media ^(max-width: 768px^) { >> src\app\%%i\%%i.component.scss
        echo   table { >> src\app\%%i\%%i.component.scss
        echo     min-width: 500px; >> src\app\%%i\%%i.component.scss
        echo   } >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss
        echo @media ^(max-width: 480px^) { >> src\app\%%i\%%i.component.scss
        echo   table { >> src\app\%%i\%%i.component.scss
        echo     min-width: 400px; >> src\app\%%i\%%i.component.scss
        echo   } >> src\app\%%i\%%i.component.scss
        echo } >> src\app\%%i\%%i.component.scss


        echo 
        if errorlevel 1 (
            echo Failed to generate component %%i
            exit /b
        )
    )
    :: creating component update.ts 
    echo import { Component, OnInit } from '@angular/core'; >src\app\update\update.component.ts
    echo import { ActivatedRoute, Router } from '@angular/router'; >>src\app\update\update.component.ts
    echo import { SharedService } from '../services/shared.service'; >>src\app\update\update.component.ts
    echo import { CommonModule } from '@angular/common'; >>src\app\update\update.component.ts
    echo import { FormsModule } from '@angular/forms'; >>src\app\update\update.component.ts

    echo @Component^({ >>src\app\update\update.component.ts
    echo  selector: 'app-update', >>src\app\update\update.component.ts
    echo  standalone: true, >>src\app\update\update.component.ts
    echo  imports: [CommonModule, FormsModule], >>src\app\update\update.component.ts
    echo  templateUrl: './update.component.html', >>src\app\update\update.component.ts
    echo  styleUrls: ['./update.component.scss'] >>src\app\update\update.component.ts
    echo }^) >>src\app\update\update.component.ts
    echo export class UpdateComponent implements OnInit { >>src\app\update\update.component.ts
    echo  table: string = '';   >>src\app\update\update.component.ts
    echo  itemId: string = ''; // ID of the item >>src\app\update\update.component.ts
    echo  itemData: any = {};  // Data of the item >>src\app\update\update.component.ts

    echo constructor^(private route: ActivatedRoute, private service: SharedService, private router: Router^) {} >>src\app\update\update.component.ts

    echo ngOnInit^(^): void { >>src\app\update\update.component.ts
    echo    this.table = this.route.snapshot.paramMap.get^('table'^) ^|^| ''; >>src\app\update\update.component.ts
    echo    this.itemId = this.route.snapshot.paramMap.get^('id'^) ^|^| ''; >>src\app\update\update.component.ts
    echo    if ^(this.table ^&^& this.itemId^) { >>src\app\update\update.component.ts
    echo     this.service.getItemById^(this.table, this.itemId^).subscribe^({ >>src\app\update\update.component.ts
    echo        next: ^(data: any^) =^> { >>src\app\update\update.component.ts
    echo        console.log^(`Fetched ${this.table} Data:`, data^); >>src\app\update\update.component.ts
    echo        if ^(data^) { >>src\app\update\update.component.ts
    echo            this.itemData = { ...data }; >>src\app\update\update.component.ts
    echo        } else {  >>src\app\update\update.component.ts
    echo            console.warn^(`No data found for ${this.table} with ID ${this.itemId}`^); >>src\app\update\update.component.ts
    echo            alert^(`Error: No data found!`^); >>src\app\update\update.component.ts
    echo        } >>src\app\update\update.component.ts
    echo        }, >>src\app\update\update.component.ts
    echo        error: ^(err^) =^> { >>src\app\update\update.component.ts
    echo         console.error^(`Error fetching ${this.table} data ^(Table: ${this.table}, ID: ${this.itemId}^)`, err^); >>src\app\update\update.component.ts
    echo        alert^(`An error occurred while fetching ${this.table} data.`^); >>src\app\update\update.component.ts
    echo        } >>src\app\update\update.component.ts
    echo     }^); >>src\app\update\update.component.ts
    echo    } >>src\app\update\update.component.ts
    echo } >>src\app\update\update.component.ts

    echo updateItem^(^) { >>src\app\update\update.component.ts
    echo    this.service.updateItemById^(this.table, this.itemId, this.itemData^).subscribe^(^{ >>src\app\update\update.component.ts
    echo      next: ^(response^) =^> { >>src\app\update\update.component.ts
    echo        console.log^("Item updated:", response^); >>src\app\update\update.component.ts
    echo        alert^("Item updated"^); >>src\app\update\update.component.ts
    echo        this.router.navigate^(^['/admin']^); // ou où tu veux rediriger après >>src\app\update\update.component.ts
    echo      ^}, >>src\app\update\update.component.ts
    echo      error: ^(err^) =^> { >>src\app\update\update.component.ts
    echo        console.error^("Erreur update :", err^); >>src\app\update\update.component.ts
    echo        alert^("Error while updating"^); >>src\app\update\update.component.ts
    echo      } >>src\app\update\update.component.ts
    echo    ^}^); >>src\app\update\update.component.ts
    echo  } >>src\app\update\update.component.ts

    echo  // Helper function to dynamically list fields >>src\app\update\update.component.ts
    echo  objectKeys^(obj: any^): string[^] { >>src\app\update\update.component.ts
    echo   return obj ? Object.keys^(obj^) : [^]; >>src\app\update\update.component.ts
    echo  } >>src\app\update\update.component.ts
    echo } >>src\app\update\update.component.ts

    :: creating component update.html
    echo ^<h2^>Update {{ table }}^</h2^> >src\app\update\update.component.html
    echo ^<form^ *ngIf="itemData && objectKeys(itemData).length > 0" ^(ngSubmit^)="updateItem()"^> >>src\app\update\update.component.html
    echo ^<ng-container^ *ngFor="let key of objectKeys(itemData)"^> >>src\app\update\update.component.html
    echo    ^<div *ngIf="key !== '_id'"^> >>src\app\update\update.component.html
    echo     ^<label^>{{ key }}:^</label^> >>src\app\update\update.component.html
    echo     ^<input type="text" [^(ngModel^)]="itemData[key]" [name]="key" /^> >>src\app\update\update.component.html
    echo ^</div^> >>src\app\update\update.component.html
    echo ^</ng-container^> >>src\app\update\update.component.html    
    echo ^<button^ type="submit"^>Update^</button^> >>src\app\update\update.component.html
    echo ^</form^> >>src\app\update\update.component.html

    :: creating component update.scss
    echo /* General form container with sleek design */ >src\app\update\update.component.scss
        echo /* General form container with sleek design */ >>src\app\update\update.component.scss
        echo form { >>src\app\update\update.component.scss
        echo     max-width: 600px; >>src\app\update\update.component.scss
        echo     margin: 40px auto; >>src\app\update\update.component.scss
        echo     padding: 40px; >>src\app\update\update.component.scss
        echo     border-radius: 12px; >>src\app\update\update.component.scss
        echo     background: linear-gradient^(135deg, #f5f4f4, #e8eff5^); >>src\app\update\update.component.scss
        echo     box-shadow: 0 8px 20px rgba^(0, 0, 0, 0.15^); >>src\app\update\update.component.scss
        echo     font-family: 'Roboto', sans-serif; >>src\app\update\update.component.scss
        echo     color: #333; >>src\app\update\update.component.scss
        echo     animation: fadeIn 0.8s ease-out; >>src\app\update\update.component.scss
        echo     transition: transform 0.3s ease, box-shadow 0.3s ease; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo @keyframes fadeIn { >>src\app\update\update.component.scss
        echo   from { >>src\app\update\update.component.scss
        echo     opacity: 0; >>src\app\update\update.component.scss
        echo     transform: translateY^(-20px^); >>src\app\update\update.component.scss
        echo   } >>src\app\update\update.component.scss
        echo   to { >>src\app\update\update.component.scss
        echo     opacity: 1; >>src\app\update\update.component.scss
        echo     transform: translateY^(0^); >>src\app\update\update.component.scss
        echo   } >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form:hover { >>src\app\update\update.component.scss
        echo   transform: translateY^(-5px^); >>src\app\update\update.component.scss
        echo   box-shadow: 0 12px 30px rgba^(0, 0, 0, 0.2^); >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo h2 { >>src\app\update\update.component.scss
        echo   font-size: 32px; >>src\app\update\update.component.scss
        echo   font-weight: bold; >>src\app\update\update.component.scss
        echo   text-align: center; >>src\app\update\update.component.scss
        echo   color: transparent; >>src\app\update\update.component.scss
        echo   background: linear-gradient^(45deg, #00264d, #008C8C^); >>src\app\update\update.component.scss
        echo   -webkit-background-clip: text; >>src\app\update\update.component.scss
        echo   background-clip: text; >>src\app\update\update.component.scss
        echo   text-transform: uppercase; >>src\app\update\update.component.scss
        echo   letter-spacing: 1.5px; >>src\app\update\update.component.scss
        echo   margin-bottom: 30px; >>src\app\update\update.component.scss
        echo   position: relative; >>src\app\update\update.component.scss
        echo   transition: transform 0.3s ease, color 0.3s ease; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo h2:hover { >>src\app\update\update.component.scss
        echo   transform: scale^(1.05^); >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form label { >>src\app\update\update.component.scss
        echo   display: block; >>src\app\update\update.component.scss
        echo   font-size: 14px; >>src\app\update\update.component.scss
        echo   font-weight: bold; >>src\app\update\update.component.scss
        echo   margin-bottom: 8px; >>src\app\update\update.component.scss
        echo   color: #444; >>src\app\update\update.component.scss
        echo   text-transform: capitalize; >>src\app\update\update.component.scss
        echo   letter-spacing: 0.5px; >>src\app\update\update.component.scss
        echo   transition: color 0.3s ease; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form label:hover { >>src\app\update\update.component.scss
        echo   color: #008C8C; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form input { >>src\app\update\update.component.scss
        echo   width: 100%%; >>src\app\update\update.component.scss
        echo   padding: 12px; >>src\app\update\update.component.scss
        echo   border: none; >>src\app\update\update.component.scss
        echo   border-radius: 8px; >>src\app\update\update.component.scss
        echo   font-size: 16px; >>src\app\update\update.component.scss
        echo   background: linear-gradient^(135deg, #ffffff, #f0f4f8^); >>src\app\update\update.component.scss
        echo   color: #333; >>src\app\update\update.component.scss
        echo   box-shadow: inset 0 2px 4px rgba^(0, 0, 0, 0.1^); >>src\app\update\update.component.scss
        echo   transition: box-shadow 0.3s ease, transform 0.3s ease; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form input:focus { >>src\app\update\update.component.scss
        echo   outline: none; >>src\app\update\update.component.scss
        echo   box-shadow: 0 0 8px rgba^(0, 140, 140, 0.5^); >>src\app\update\update.component.scss
        echo   transform: translateY^(-2px^); >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form input:hover { >>src\app\update\update.component.scss
        echo   box-shadow: inset 0 4px 6px rgba^(0, 0, 0, 0.1^); >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form button { >>src\app\update\update.component.scss
        echo   background: linear-gradient^(45deg, #012344, #012344^); >>src\app\update\update.component.scss
        echo   color: #fff; >>src\app\update\update.component.scss
        echo   width: 80%%; >>src\app\update\update.component.scss
        echo   border: none; >>src\app\update\update.component.scss
        echo   border-radius: 8px; >>src\app\update\update.component.scss
        echo   font-size: 14px; >>src\app\update\update.component.scss
        echo   font-weight: bold; >>src\app\update\update.component.scss
        echo   margin: 20px auto 0; >>src\app\update\update.component.scss
        echo   display: block; >>src\app\update\update.component.scss
        echo   text-transform: uppercase; >>src\app\update\update.component.scss
        echo   cursor: pointer; >>src\app\update\update.component.scss
        echo   box-shadow: 0 6px 12px rgba^(0, 140, 140, 0.2^); >>src\app\update\update.component.scss
        echo   transition: transform 0.3s ease, box-shadow 0.3s ease; >>src\app\update\update.component.scss
        echo   padding: 10px; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form button:hover { >>src\app\update\update.component.scss
        echo   transform: translateY^(-4px^); >>src\app\update\update.component.scss
        echo   box-shadow: 0 8px 16px rgba^(0, 140, 140, 0.3^); >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form button:active { >>src\app\update\update.component.scss
        echo   transform: translateY^(2px^); >>src\app\update\update.component.scss
        echo   box-shadow: 0 4px 8px rgba^(0, 140, 140, 0.2^); >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo form div { >>src\app\update\update.component.scss
        echo   margin-bottom: 20px; >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
        echo @media ^(max-width: 600px^) { >>src\app\update\update.component.scss
        echo   form { >>src\app\update\update.component.scss
        echo     padding: 30px; >>src\app\update\update.component.scss
        echo     margin: 20px; >>src\app\update\update.component.scss
        echo   } >>src\app\update\update.component.scss
        echo   form h2 { >>src\app\update\update.component.scss
        echo     font-size: 28px; >>src\app\update\update.component.scss
        echo   } >>src\app\update\update.component.scss
        echo   form button { >>src\app\update\update.component.scss
        echo     font-size: 16px; >>src\app\update\update.component.scss
        echo   } >>src\app\update\update.component.scss
        echo } >>src\app\update\update.component.scss
    :: Create the shared service for all components
    echo ===== Creating shared service for components =====
    ng g s services/shared
    echo import { Injectable } from '@angular/core'; > src\app\services\shared.service.ts
    echo import { HttpClient } from '@angular/common/http'; >> src\app\services\shared.service.ts
    echo import { Observable } from 'rxjs'; >> src\app\services\shared.service.ts
    echo @Injectable^(^{ >> src\app\services\shared.service.ts
    echo    providedIn: 'root' >> src\app\services\shared.service.ts
    echo }  >> src\app\services\shared.service.ts
    echo ^) >> src\app\services\shared.service.ts
    echo export class SharedService { >> src\app\services\shared.service.ts
    echo   private apiUrl = 'http://localhost:3000/api'; >> src\app\services\shared.service.ts
    echo   constructor^(private http: HttpClient^) { ^} >> src\app\services\shared.service.ts
    echo   getUsers(^) { >> src\app\services\shared.service.ts
    echo    return this.http.get^(`${this.apiUrl}/getall`^); //HERE >> src\app\services\shared.service.ts
    echo   } >> src\app\services\shared.service.ts
    echo  getTableData^(table: string^): Observable^<any[^]^> { // Doit retourner un Observable >> src\app\services\shared.service.ts
    echo   return this.http.get^<any[^]^>^(`${this.apiUrl}/getall/${table}`^); >> src\app\services\shared.service.ts
    echo } >> src\app\services\shared.service.ts
    echo getItemById^(table: string, id: string^) { >> src\app\services\shared.service.ts
    echo   return this.http.get^(`${this.apiUrl}/${table}/${id}`^); >> src\app\services\shared.service.ts
    echo  } >> src\app\services\shared.service.ts
    echo  updateItemById^(table: string, id: string, data: any^) { >> src\app\services\shared.service.ts
    echo   return this.http.put^(`${this.apiUrl}/update/${table}/${id}`, data^); >> src\app\services\shared.service.ts
    echo } >> src\app\services\shared.service.ts
    echo deleteItem^(table: string, id: string^) { >> src\app\services\shared.service.ts
    echo   return this.http.delete^(`http://localhost:3000/api/delete/${table}/${id}`^); //HERE >> src\app\services\shared.service.ts
    echo } >> src\app\services\shared.service.ts
    echo deleteTable^(table: string^): Observable^<any^> { >> src\app\services\shared.service.ts
    echo   return this.http.delete^(`${this.apiUrl}/delete/${table}`^); >> src\app\services\shared.service.ts
    echo } >> src\app\services\shared.service.ts
    echo } >> src\app\services\shared.service.ts
    if errorlevel 1 (
        echo Failed to generate the shared service!
        exit /b
    )
    :: Écriture du fichier index.html avec les composants générés
    echo ^<!doctype html^> > src\index.html
    echo ^<html lang="en"^> >> src\index.html
    echo   ^<head^> >> src\index.html
    echo     ^<meta charset="utf-8"^> >> src\index.html
    echo     ^<title^>AngularProject^</title^> >> src\index.html
    echo     ^<base href="/"^> >> src\index.html
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1"^> >> src\index.html
    echo     ^<link rel="icon" type="image/x-icon" href="favicon.ico"^> >> src\index.html
    echo ^<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"^>  >> src\index.html
    echo   ^</head^> >> src\index.html
    echo   ^<body^> >> src\index.html
    echo     ^<app-root^>^</app-root^> >> src\index.html
    echo     ^<app-admin^>^</app-admin^> >> src\index.html
    echo      ^<app-sidebar^>^</app-sidebar^> >> src\index.html
    for %%i in (%items%) do (
        echo     ^<app-%%i^>^</app-%%i^> >> src\index.html
    )
    echo   ^</body^> >> src\index.html
    echo ^</html^> >> src\index.html

    :: Vérification
    if errorlevel 1 (
        echo Erreur lors de l'écriture de index.html!
        exit /b 
    )
    
:: Install dependencies after generation
    echo ===== Installing dependencies... This may take some time... =====
    npm install 
    if errorlevel 1 (
        echo Failed to install dependencies!
        exit /b
)

) else (
    echo Angular project already exists!
    cd "%projectDir%"
)

echo ===== All components and shared service generated successfully! =====
:: Define script path (DON'T use PATH, it's a system variable)
set "SCRIPT_PATH=%~dp0angular-project"

:: Check if folder exists (was index.js — not correct for Angular)
if not exist "%SCRIPT_PATH%\angular.json" (
    echo Angular project not found: %SCRIPT_PATH%
    exit /b
)

cd /d "%SCRIPT_PATH%"

:: Start the Angular server
echo Starting the server...
start ng serve
endlocal
