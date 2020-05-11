import { TestBed } from '@angular/core/testing';

import { NgxFormService } from './ngx-form.service';

describe('NgxFormService', () => {
  let service: NgxFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
