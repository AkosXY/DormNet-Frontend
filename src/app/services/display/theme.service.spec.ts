import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockClassList: any;
  let mockDocument: any;
  let store: Record<string, string>;
  let setItemSpy: jest.SpyInstance, getItemSpy: jest.SpyInstance;

  beforeEach(() => {
    mockClassList = { add: jest.fn(), remove: jest.fn() };
    mockDocument = { documentElement: { classList: mockClassList } };

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });

    store = {};
    setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem')
      .mockImplementation((key: any, val: any) => { store[key] = val; });
    getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem')
      .mockImplementation((key: any) => store[key] || null);

    service = TestBed.inject(ThemeService);

    mockClassList.add.mockClear();
    mockClassList.remove.mockClear();
    setItemSpy.mockClear();
  });

  afterEach(() => {
    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
  });

  it('toggle() switches from light to dark', () => {
    service.setTheme('light');
    service.toggle();
    expect(mockClassList.add).toHaveBeenCalledWith('dark-mode');
    expect(mockClassList.remove).toHaveBeenCalledWith('light-mode');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
  });

  it('toggle() switches from dark to light', () => {
    service.setTheme('dark');
    service.toggle();
    expect(mockClassList.add).toHaveBeenCalledWith('light-mode');
    expect(mockClassList.remove).toHaveBeenCalledWith('dark-mode');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
  });
});
