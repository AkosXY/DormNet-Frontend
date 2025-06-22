import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureCardComponent } from './feature-card.component';
import {ActivatedRoute} from '@angular/router';

describe('FeatureCardComponent', () => {
  let component: FeatureCardComponent;
  let fixture: ComponentFixture<FeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
