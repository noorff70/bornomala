import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathhistorydetailComponent } from './mathhistorydetail.component';

describe('MathhistorydetailComponent', () => {
  let component: MathhistorydetailComponent;
  let fixture: ComponentFixture<MathhistorydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathhistorydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathhistorydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
