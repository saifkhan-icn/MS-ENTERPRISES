import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  const accessStorageKey = 'ms-enterprises-access-role';

  beforeEach(async () => {
    try {
      window.localStorage.clear();
    } catch {
      // Ignore storage issues in the test environment.
    }

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the enterprise brand', () => {
    window.localStorage.setItem(accessStorageKey, 'admin');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('M S ENTERPRISES');
  });

  it('should render seeded catalog cards', () => {
    window.localStorage.setItem(accessStorageKey, 'admin');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.product-card').length).toBeGreaterThan(0);
  });

  it('should show login screen when no access role is stored', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.login-card')).toBeTruthy();
  });
});
