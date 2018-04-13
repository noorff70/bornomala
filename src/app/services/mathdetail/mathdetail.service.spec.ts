import { TestBed, inject } from '@angular/core/testing';

import { MathdetailService } from './mathdetail.service';

describe('MathdetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MathdetailService]
    });
  });

  it('should be created', inject([MathdetailService], (service: MathdetailService) => {
    expect(service).toBeTruthy();
  }));
});
