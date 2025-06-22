import { TestBed } from '@angular/core/testing';
import { CreateResourceDialogComponent } from './create-resource-dialog.component';
import { ResourceService } from '../../../services/api/resource.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CreateResourceDialogComponent', () => {
  let component: CreateResourceDialogComponent;
  let resourceServiceMock: { createResource: jest.Mock };
  let dialogRefMock: { close: jest.Mock };

  beforeEach(async () => {
    resourceServiceMock = { createResource: jest.fn() };
    dialogRefMock = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CreateResourceDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: ResourceService, useValue: resourceServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CreateResourceDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid by default', () => {
    expect(component.submitForm.invalid).toBe(true);
  });

  it('form should be valid with required values', () => {
    component.submitForm.patchValue({ name: 'Resource A', available: true });
    expect(component.submitForm.valid).toBe(true);
  });

  it('should not call service or close dialog if form is invalid', () => {
    component.submitForm.patchValue({ name: '' }); // missing required
    component.submit();
    expect(resourceServiceMock.createResource).not.toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should call createResource and close dialog on successful submit', () => {
    component.submitForm.patchValue({ name: 'Resource B', available: false });
    resourceServiceMock.createResource.mockReturnValue(of(true));
    component.submit();
    expect(resourceServiceMock.createResource).toHaveBeenCalledWith({
      name: 'Resource B',
      available: false
    });
    expect(dialogRefMock.close).toHaveBeenCalledWith('refresh');
  });

  it('should not close dialog if createResource returns false', () => {
    component.submitForm.patchValue({ name: 'Resource C', available: true });
    resourceServiceMock.createResource.mockReturnValue(of(false));
    component.submit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should expose name and available form controls through getters', () => {
    expect(component.name).toBe(component.submitForm.get('name'));
    expect(component.available).toBe(component.submitForm.get('available'));
  });
});
