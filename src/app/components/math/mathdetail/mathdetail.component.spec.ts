import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathdetailComponent } from './mathdetail.component';

describe('MathdetailComponent', () => {
  let component: MathdetailComponent;
  let fixture: ComponentFixture<MathdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
