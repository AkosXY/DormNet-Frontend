import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignResidentDialogComponent } from './assign-resident-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccommodationService } from '../../../services/api/accommodation.service';
import { Room } from '../../../model/room';
import { Resident } from '../../../model/resident';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { of } from 'rxjs';

const mockRoom: Room = {
  id: 101,
  name: 'Example Room',
} as unknown as Room;
const mockResidents: Resident[] = [
  { id: 1, name: 'Anna Smith' } as Resident,
  { id: 2, name: 'Bob Brown' } as Resident,
];
const accommodationServiceMock = {
  getUnassignedResidents: jest.fn(),
  assignResidentToRoom: jest.fn(),
};
const matDialogRefMock = { close: jest.fn() };


describe('AssignResidentDialogComponent', () => {
  let fixture: ComponentFixture<AssignResidentDialogComponent>;
  let component: AssignResidentDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignResidentDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { room: mockRoom } },
        { provide: AccommodationService, useValue: accommodationServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignResidentDialogComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data.room).toEqual(mockRoom);
    expect(component.residents).toEqual([]);
    expect(component.selectedResident).toBeNull();
  });

  it('should load unassigned residents on ngOnInit', () => {
    (accommodationServiceMock.getUnassignedResidents as jest.Mock)
      .mockReturnValue(of(mockResidents));
    component.ngOnInit();
    expect(accommodationServiceMock.getUnassignedResidents).toHaveBeenCalled();

    expect(component.residents).toEqual(mockResidents);
  });

  it('should assign resident and close dialog', () => {
    component.selectedResident = mockResidents[1];
    (accommodationServiceMock.assignResidentToRoom as jest.Mock)
      .mockReturnValue(of({}));
    component.assignResident();
    expect(accommodationServiceMock.assignResidentToRoom).toHaveBeenCalledWith(
      2,
      mockRoom.id
    );
    expect(matDialogRefMock.close).toHaveBeenCalledWith('assigned');
  });

  it('should do nothing if assignResident is called with no selectedResident', () => {
    component.selectedResident = null;
    component.assignResident();
    expect(accommodationServiceMock.assignResidentToRoom).not.toHaveBeenCalled();
    expect(matDialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should filter residents by searchTerm case-insensitively', () => {
    component.residents = mockResidents;
    component.searchTerm = 'SMI';
    const filtered = component.filteredResidents();
    expect(filtered.length).toBe(1);
    expect(filtered[0]).toEqual(mockResidents[0]);
  });

  it('should filter all residents if searchTerm is empty', () => {
    component.residents = mockResidents;
    component.searchTerm = '';
    const filtered = component.filteredResidents();
    expect(filtered).toEqual(mockResidents);
  });

  it('should not fail when resident array is empty', () => {
    component.residents = [];
    component.searchTerm = 'a';
    expect(component.filteredResidents()).toEqual([]);
  });

  it('displayResident should return resident name or empty string', () => {
    expect(component.displayResident(mockResidents[0])).toBe('Anna Smith');
    expect(component.displayResident(null as any)).toBe('');
  });

  it('onResidentSelected sets selectedResident', () => {
    const fakeEvent = {
      option: { value: mockResidents[1] }
    } as any as MatAutocompleteSelectedEvent;
    component.onResidentSelected(fakeEvent);
    expect(component.selectedResident).toBe(mockResidents[1]);
  });
});
