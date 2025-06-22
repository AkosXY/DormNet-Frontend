import {TestBed, ComponentFixture, tick, fakeAsync} from "@angular/core/testing";
import { ResourceComponent } from "./resource.component";
import { ResourceService } from "../../services/api/resource.service";
import { MatDialog } from "@angular/material/dialog";
import Keycloak from 'keycloak-js';
import {of, Subject, throwError} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: class Keycloak {
    hasRealmRole() { return false; }
  }
}));


const resourceServiceMock = {
  getResources: jest.fn().mockReturnValue(of([])),
  makeAvailable: jest.fn().mockReturnValue(of({})),
  makeUnavailable: jest.fn().mockReturnValue(of({})),
  deleteResource: jest.fn().mockReturnValue(of({}))
};

const matDialogMock = {
  open: jest.fn()
};

describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceComponent],
      providers: [
        { provide: ResourceService, useValue: resourceServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: Keycloak, useValue: new Keycloak('') }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;

    component.input = { nativeElement: document.createElement('input') };
    component.paginator = {} as MatPaginator;
    component.sort = {} as MatSort;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('ngOnInit', () => {
    it('calls initialization routines', () => {
      const t = jest.spyOn(component, 'initTable').mockImplementation();
      const d = jest.spyOn(component, 'initDebounce').mockImplementation();
      const c = jest.spyOn<any, any>(component, 'initDisplayedColumns').mockImplementation();
      component.ngOnInit();
      expect(t).toHaveBeenCalled();
      expect(d).toHaveBeenCalled();
      expect(c).toHaveBeenCalled();
    });
  });

  describe('initTable', () => {
    it('sets up the data source and sorting', () => {
      const data = [{ id: 1, available: true, name: 'foo' }];
      resourceServiceMock.getResources.mockReturnValueOnce(of(data));
      component.initTable();
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
      expect(component.dataSource.data).toEqual(data);
      expect(component.dataSource.paginator).toBe(component.paginator);
      expect(component.dataSource.sort).toBe(component.sort);
      expect(component.dataSource.sortingDataAccessor(data[0], 'enabled')).toBe(true);
      expect(component.dataSource.sortingDataAccessor(data[0], 'name')).toBe('foo');
    });
  });

  describe('initDebounce', () => {
    it('calls applyFilter after debounce', fakeAsync(() => {
      const spy = jest.spyOn(component, 'applyFilter');
      component.initDebounce();

      const el = component.input.nativeElement;
      el.value = 'searchword';

      el.dispatchEvent(new Event('keyup'));
      tick(500);
      expect(spy).toHaveBeenCalledWith('searchword');
    }));
  });

  describe('applyFilter', () => {
    it('sets filter on dataSource', () => {
      component.dataSource = { filter: '' };
      component.applyFilter('  FooBar   ');
      expect(component.dataSource.filter).toBe('foobar');
    });
    it('does not throw on null/undefined', () => {
      component.dataSource = { filter: '' };
      expect(() => component.applyFilter(undefined)).not.toThrow();
      expect(() => component.applyFilter(null)).not.toThrow();
    });
  });

  describe('onCreate', () => {
    it('opens dialog and refreshes on "refresh"', () => {
      const afterClosed$ = new Subject<string>();
      matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });
      const spy = jest.spyOn(component, 'initTable');
      component.onCreate();
      afterClosed$.next('refresh');
      expect(matDialogMock.open).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      afterClosed$.complete();
    });
    it('does not refresh for other dialog results', () => {
      const afterClosed$ = new Subject<string>();
      matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });
      const spy = jest.spyOn(component, 'initTable');
      component.onCreate();
      afterClosed$.next('not-refresh');
      expect(spy).not.toHaveBeenCalled();
      afterClosed$.complete();
    });
  });

  describe('openReservationDialog', () => {
    it('opens reservation dialog and subscribes', () => {
      const afterClosed$ = new Subject<string>();
      matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });
      component.openReservationDialog({ id: 1, name: 'foo' } as any);
      expect(matDialogMock.open).toHaveBeenCalled();
      afterClosed$.next('refresh');
      afterClosed$.complete();
    });
  });

  describe('onToggleChange', () => {
    it('makes available and flips resource', () => {
      const el = { id: 123, available: false };
      const evt = { checked: true, source: { checked: false } };
      resourceServiceMock.makeAvailable.mockReturnValueOnce(of({}));
      component.onToggleChange(evt as any, el);
      expect(resourceServiceMock.makeAvailable).toHaveBeenCalledWith(123);
      expect(el.available).toBe(true);
    });

    it('sets toggle false on error', () => {
      const el = { id: 99, available: false };
      const evt = { checked: true, source: { checked: false } };
      resourceServiceMock.makeAvailable.mockReturnValueOnce(
        throwError(() => new Error('fail'))
      );
      component.onToggleChange(evt as any, el);
      expect(evt.source.checked).toBe(false);
    });

    it('shows confirm dialog, makes unavailable when confirmed', () => {
      const el = { id: 88, name: 'x', available: true };
      const evt = { checked: false, source: { checked: true } };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });
      resourceServiceMock.makeUnavailable.mockReturnValue(of({}));
      component.onToggleChange(evt as any, el);
      afterClosed$.next(true);
      expect(resourceServiceMock.makeUnavailable).toHaveBeenCalledWith(88);
      afterClosed$.complete();
    });

    it('sets toggle true if user CANCELS confirm', () => {
      const el = { id: 1, name: 'n', available: true };
      const evt = { checked: false, source: { checked: true } };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });
      component.onToggleChange(evt as any, el);
      afterClosed$.next(false);
      expect(evt.source.checked).toBe(true);
      afterClosed$.complete();
    });

    it('resets toggle if makeUnavailable errors', () => {
      const el = { id: 55, name: 'f', available: true };
      const evt = { checked: false, source: { checked: true } };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });
      resourceServiceMock.makeUnavailable.mockReturnValue(
        throwError(() => new Error('fail'))
      );
      component.onToggleChange(evt as any, el);
      afterClosed$.next(true);
      expect(evt.source.checked).toBe(true);
      afterClosed$.complete();
    });
  });

  describe('onDelete', () => {
    it('should show warning dialog if resource is available', () => {
      component.onDelete({ id: 1, name: 'Resource1', available: true } as any);
      expect(matDialogMock.open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.stringContaining('must be disabled')
        })
      );
    });

    it('should call deleteResource and refresh on successful confirm/delete', () => {
      const el = { id: 2, name: 'foo', available: false };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValueOnce({ afterClosed: () => afterClosed$ });
      resourceServiceMock.deleteResource.mockReturnValueOnce(of(true));
      const refreshSpy = jest.spyOn(component, 'initTable');
      matDialogMock.open.mockReturnValue({ afterClosed: () => of(null) });

      component.onDelete(el as any);
      afterClosed$.next(true);
      afterClosed$.complete();

      expect(resourceServiceMock.deleteResource).toHaveBeenCalledWith(2);
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should show not-deleted dialog when deleteResource returns falsy', () => {
      const el = { id: 3, name: 'bar', available: false };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValueOnce({ afterClosed: () => afterClosed$ });
      resourceServiceMock.deleteResource.mockReturnValueOnce(of(false));
      matDialogMock.open.mockClear();

      component.onDelete(el as any);
      afterClosed$.next(true);
      afterClosed$.complete();

      expect(matDialogMock.open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.stringContaining('Could not delete "bar"')
        })
      );
    });

    it('should show error dialog on deleteResource error', () => {
      const el = { id: 4, name: 'baz', available: false };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValueOnce({ afterClosed: () => afterClosed$ });
      resourceServiceMock.deleteResource.mockReturnValueOnce(throwError(() => new Error('fail')));
      matDialogMock.open.mockClear();

      component.onDelete(el as any);
      afterClosed$.next(true);
      afterClosed$.complete();

      expect(matDialogMock.open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.stringContaining('Error occurred while deleting "baz"')
        })
      );
    });

    it('should do nothing when dialog not confirmed', () => {
      const el = { id: 5, name: 'baz', available: false };
      const afterClosed$ = new Subject<boolean>();
      matDialogMock.open.mockReturnValueOnce({ afterClosed: () => afterClosed$ });
      resourceServiceMock.deleteResource.mockClear();

      component.onDelete(el as any);
      afterClosed$.next(false);
      afterClosed$.complete();

      expect(resourceServiceMock.deleteResource).not.toHaveBeenCalled();
    });
  });


});
