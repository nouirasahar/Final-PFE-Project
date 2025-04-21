import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemlogsComponent } from './systemlogs.component';

describe('SystemlogsComponent', () => {
  let component: SystemlogsComponent;
  let fixture: ComponentFixture<SystemlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
