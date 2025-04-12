import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent, IonicModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of ModalComponent', () => {
    expect(component).toBeTruthy();
  });
});

describe('ModalComponent - Button "Adicionar"', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent, IonicModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the button', () => {
    const itemDebugEl = fixture.debugElement.query(
      By.css('[data-testid="button-add"]')
    );

    fixture.detectChanges();
    expect(itemDebugEl).toBeTruthy();
  });

  it('should have a text "Adicionar" in the button', () => {
    const text = 'Adicionar';
    fixture.detectChanges();

    const itemDebugEl = fixture.debugElement.query(
      By.css('[data-testid="button-text"]')
    );

    fixture.detectChanges();
    expect(itemDebugEl.nativeElement.textContent).toBe(text);
  });

  it('should render an icon inside the button', () => {
    const itemDebugEl = fixture.debugElement.query(
      By.css('[data-testid="button-icon"]')
    );

    expect(itemDebugEl).toBeTruthy();
  });
});
