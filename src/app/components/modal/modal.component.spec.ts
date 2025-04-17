import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

@Component({
  template: `<app-modal [player]="player"></app-modal>`,
})
class TestHostComponent {
  player: any;
}

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

describe('ModalComponent - NgOnChanges', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let modalComponent: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    hostComponent = fixture.componentInstance;

    fixture.detectChanges();

    const modalDebugEl = fixture.debugElement.query(
      By.directive(ModalComponent)
    );

    fixture.detectChanges();

    expect(modalDebugEl).not.toBeNull();
    modalComponent = modalDebugEl?.componentInstance;
  });

  it('should check if player ID is undefined', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    const modalComponent = fixture.componentInstance;
    const valueFromPlayer = modalComponent.player?.id;

    expect(valueFromPlayer).toBe(undefined);
  });

  it('should check if player ID NOT to be undefined', waitForAsync(() => {
    spyOn(modalComponent, 'ngOnChanges').and.callThrough();

    hostComponent.player = {
      id: '1',
      name: 'Julio',
      team: 'Manchester City',
      thumbnail: 'manchester-city',
      updatedAt: '12/12/2025',
    };

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(modalComponent.ngOnChanges).toHaveBeenCalled();
      expect(modalComponent.player?.id).not.toBe(undefined);
    });
  }));
});
