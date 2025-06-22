  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { AccommodationComponent } from './accommodation.component';
  import { NO_ERRORS_SCHEMA} from '@angular/core';
  import {provideHttpClient} from '@angular/common/http';
  import {provideHttpClientTesting} from '@angular/common/http/testing';
  import {Resident} from '../../model/resident';
  import {Room} from '../../model/room';
  import {MatDialog} from '@angular/material/dialog';
  import {AssignResidentDialogComponent} from './assign-resident-dialog/assign-resident-dialog.component';
  import {CreateRoomDialogComponent} from './create-room-dialog/create-room-dialog.component';


  jest.mock('keycloak-js', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
  }));

  jest.mock('lodash-es', () => {
    return {
      __esModule: true,
      add: jest.fn(),
      remove: jest.fn(),
    }
  });

  jest.mock('../../directives/has-role.directive', () => ({
    HasRoleDirective: require('../../directives/has-role-stub.directive').HasRoleStubDirective
  }));

  const mockDialogRef = {
    afterClosed: jest.fn()
  };

  const mockDialog = {
    open: jest.fn()
  };


  const mockResidents: Resident[] = [
    { id: 1, name: 'Alice' } as Resident,
    { id: 2, name: 'Bob' } as Resident,
  ];
  const mockRooms: Room[] = [
    { number: '101', residents: [mockResidents[0]], numOfResidents: 1, capacity: 2 } as Room,
    { number: '102', residents: [mockResidents[1]], numOfResidents: 2, capacity: 2 } as Room,
    {number: '201', residents: [], numOfResidents: 0, capacity: 1} as unknown as Room,
  ];

  describe('AccommodationComponent', () => {
    let component: AccommodationComponent;
    let fixture: ComponentFixture<AccommodationComponent>;

    beforeEach(async () => {

      mockDialog.open.mockReset();
      mockDialogRef.afterClosed.mockReset();
      await TestBed.configureTestingModule({
        imports: [AccommodationComponent],
        providers:[provideHttpClient(), provideHttpClientTesting(),  { provide: MatDialog, useValue: mockDialog },],
        declarations:[],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(AccommodationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should filter rooms by room number', () => {
      component.loadedRooms = mockRooms;
      component.searchRoomNumber = '101';
      const res = component.filteredRooms(mockRooms);
      expect(res.length).toBe(1);
      expect(res[0].number).toBe('101');
    });

    it('should filter rooms by resident name', () => {
      component.loadedRooms = mockRooms;
      component.searchRoomNumber = '';
      component.searchResidentName = 'Bob';
      const res = component.filteredRooms(mockRooms);
      expect(res.length).toBe(1);
      expect(res[0].residents[0].name).toBe('Bob');
    });

    it('should filter rooms with available capacity', () => {
      component.loadedRooms = mockRooms;
      component.searchRoomNumber = '';
      component.searchResidentName = '';
      component.filterAvailableCapacity = true;
      const res = component.filteredRooms(mockRooms);
      expect(res.length).toBe(2);
      expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ number: '101' }),
          expect.objectContaining({ number: '201' }),
        ]),
      );
    });

    it('should return paginated rooms', () => {
      component.pageSize = 2;
      component.pageIndex = 0;
      const paginatedRooms = component.getPaginatedRooms(mockRooms);
      expect(paginatedRooms.length).toBe(2);
      expect(paginatedRooms).toEqual([mockRooms[0], mockRooms[1]]);
    });

    it('should update paginatedRooms according to pageSize and pageIndex', () => {
      component.filteredRoomsList = mockRooms;
      component.pageSize = 2;
      component.pageIndex = 0;
      component.updatePaginatedRooms();
      expect(component.paginatedRooms.length).toBe(2);
      expect(component.paginatedRooms).toEqual([mockRooms[0], mockRooms[1]]);

      component.pageIndex = 1;
      component.updatePaginatedRooms();
      expect(component.paginatedRooms.length).toBe(1);
      expect(component.paginatedRooms[0]).toEqual(mockRooms[2]);
    });

    it('should emit value on room number search change', () => {
      const spy = jest.spyOn(component['searchRoomNumberSubject'], 'next');
      component.searchRoomNumber = '202';
      component.onSearchRoomNumberChange();
      expect(spy).toHaveBeenCalledWith('202');
    });

    it('should open AssignResidentDialogComponent with room data and reload rooms if assigned', () => {
      const mockRoom = {number: '101', residents: [], numOfResidents: 0, capacity: 1} as unknown as Room;
      const afterClosed$ = {
        subscribe: (fn: (result: any) => void) => fn('assigned')
      };
      mockDialogRef.afterClosed.mockReturnValue(afterClosed$);
      mockDialog.open.mockReturnValue(mockDialogRef);

      const loadRoomsSpy = jest.spyOn(component, 'loadRooms');

      component.openAssignResidentDialog(mockRoom);

      expect(mockDialog.open).toHaveBeenCalledWith(AssignResidentDialogComponent, {
        data: { room: mockRoom },
        autoFocus: false,
      });
      expect(loadRoomsSpy).toHaveBeenCalled();
    });

    it('should not reload rooms if assigned dialog is closed with another result', () => {
      const mockRoom = {number: '101', residents: [], numOfResidents: 0, capacity: 1} as unknown as Room;
      mockDialogRef.afterClosed.mockReturnValue({
        subscribe: (fn: (result: any) => void) => fn('not-assigned')
      });
      mockDialog.open.mockReturnValue(mockDialogRef);

      const loadRoomsSpy = jest.spyOn(component, 'loadRooms');

      component.openAssignResidentDialog(mockRoom);

      expect(loadRoomsSpy).not.toHaveBeenCalled();
    });

    it('should emit value on resident name search change', () => {
      const nextSpy = jest.spyOn(component['searchResidentNameSubject'], 'next');
      component.searchResidentName = 'Alice';
      component.onSearchResidentNameChange();
      expect(nextSpy).toHaveBeenCalledWith('Alice');
    });

    it('should open CreateRoomDialogComponent and reload rooms if result is refresh', () => {
      const afterClosed$ = {
        subscribe: (fn: (result: any) => void) => fn('refresh')
      };
      mockDialogRef.afterClosed.mockReturnValue(afterClosed$);
      mockDialog.open.mockReturnValue(mockDialogRef);

      const loadRoomsSpy = jest.spyOn(component, 'loadRooms');

      component.onRoomCreate();

      expect(mockDialog.open).toHaveBeenCalledWith(CreateRoomDialogComponent, {
        autoFocus: false,
      });
      expect(loadRoomsSpy).toHaveBeenCalled();
    });

    it('should not reload rooms if onRoomCreate result is not refresh', () => {
      mockDialogRef.afterClosed.mockReturnValue({
        subscribe: (fn: (result: any) => void) => fn('no-refresh')
      });
      mockDialog.open.mockReturnValue(mockDialogRef);

      const loadRoomsSpy = jest.spyOn(component, 'loadRooms');

      component.onRoomCreate();

      expect(loadRoomsSpy).not.toHaveBeenCalled();
    });

    it('should update filteredRoomsList, paginatedRooms, and chartData on search change', () => {
      // Set initial state
      component.loadedRooms = [{number: '1', residents: [], numOfResidents: 0, capacity: 1}] as unknown as Room[];

      // Mock methods and values
      const filteredRoomsList = [{number: '2', residents: [], numOfResidents: 0, capacity: 1}] as unknown as Room[];
      const paginatedRooms = [{number: '2', residents: [], numOfResidents: 0, capacity: 1}] as unknown as Room[];

      const filteredRoomsSpy = jest.spyOn(component, 'filteredRooms').mockReturnValue(filteredRoomsList);
      const updatePaginatedRoomsSpy = jest.spyOn(component, 'updatePaginatedRooms').mockImplementation(() => {
        component.paginatedRooms = paginatedRooms;
      });
      const updateChartDataSpy = jest.spyOn(component, 'updateChartData');

      component.onSearchChange();

      expect(filteredRoomsSpy).toHaveBeenCalledWith(component.loadedRooms);
      expect(updatePaginatedRoomsSpy).toHaveBeenCalled();
      expect(updateChartDataSpy).toHaveBeenCalledWith(paginatedRooms);
      expect(component.filteredRoomsList).toBe(filteredRoomsList);
    });

  });
