import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResourceDialogComponent } from './create-resource-dialog.component';

describe('CreateResourceDialogComponent', () => {
  let component: CreateResourceDialogComponent;
  let fixture: ComponentFixture<CreateResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResourceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
