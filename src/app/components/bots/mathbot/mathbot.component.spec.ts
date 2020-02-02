import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathbotComponent } from './mathbot.component';

describe('MathbotComponent', () => {
  let component: MathbotComponent;
  let fixture: ComponentFixture<MathbotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathbotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
