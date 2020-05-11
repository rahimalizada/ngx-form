import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AbstractFormComponent } from './abstract-form-component';

@Component({
  selector: 'test-component',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="comp" formControlName="comp" />
      <button type="submit">Submit</button>
      <button type="reset">Cancel</button>
    </form>
  `,
})
class TestComponent extends AbstractFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {
    super(true, 'Generic error message');
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      comp: ['', [Validators.required, Validators.minLength(5)]],
      group: this.fb.group({
        groupelement: ['', [Validators.required, Validators.minLength(5)]],
      }),
      arr: this.fb.array([
        this.fb.group({
          arrelement: ['', [Validators.required, Validators.minLength(5)]],
        }),
      ]),
    });
  }
}

let component: TestComponent;
let fixture: ComponentFixture<TestComponent>;

function sharedSetup() {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TestComponent],
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
    component.ngOnInit();
  });
}

describe('AbstractFormComponent', () => {
  sharedSetup();

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return validity state of a component', () => {
    expect(component.isInvalid('comp')).toBe(false);

    component.form.get('comp').markAsDirty();
    expect(component.isInvalid('comp')).toBe(true);
    component.form.get('comp').markAsPristine();
    expect(component.isInvalid('comp')).toBe(false);

    component.form.get('comp').markAsTouched();
    expect(component.isInvalid('comp')).toBe(true);
    component.form.get('comp').markAsUntouched();
    expect(component.isInvalid('comp')).toBe(false);
  });

  it('should return validity state of a group', () => {
    expect(component.isInvalid('groupelement', 'group')).toBe(false);

    component.form.get('group').get('groupelement').markAsDirty();
    expect(component.isInvalid('groupelement', 'group')).toBe(true);
    component.form.get('group').get('groupelement').markAsPristine();
    expect(component.isInvalid('groupelement', 'group')).toBe(false);

    component.form.get('group').get('groupelement').markAsTouched();
    expect(component.isInvalid('groupelement', 'group')).toBe(true);
    component.form.get('group').get('groupelement').markAsUntouched();
    expect(component.isInvalid('groupelement', 'group')).toBe(false);
  });

  it('should return validity state of an array', () => {
    expect(component.isInvalid('arrelement', 'arr', 0)).toBe(false);

    (component.form.get('arr') as FormArray)
      .at(0)
      .get('arrelement')
      .markAsDirty();
    expect(component.isInvalid('arrelement', 'arr', 0)).toBe(true);
    (component.form.get('arr') as FormArray)
      .at(0)
      .get('arrelement')
      .markAsPristine();
    expect(component.isInvalid('arrelement', 'arr', 0)).toBe(false);

    (component.form.get('arr') as FormArray)
      .at(0)
      .get('arrelement')
      .markAsTouched();
    expect(component.isInvalid('arrelement', 'arr', 0)).toBe(true);
    (component.form.get('arr') as FormArray)
      .at(0)
      .get('arrelement')
      .markAsUntouched();
    expect(component.isInvalid('arrelement', 'arr', 0)).toBe(false);
  });

  it('should reset form onCancel', () => {
    component.form.get('comp').markAsDirty();
    component.errorMessage = 'err';
    component.showSuccessMessage = true;
    expect(component.form.dirty).toBe(true);
    expect(component.errorMessage).toBe('err');
    expect(component.showSuccessMessage).toBe(true);

    component.onCancel();

    expect(component.form.dirty).toBe(false);
    expect(component.errorMessage).toBe(null);
    expect(component.showSuccessMessage).toBe(false);
  });

  it('should modify onSubmit', () => {
    component.submitButtonDisabled = false;
    component.errorMessage = 'err';
    component.showSuccessMessage = true;
    component.form.markAsUntouched();

    expect(component.form.touched).toBe(false);
    expect(component.submitButtonDisabled).toBe(false);
    expect(component.errorMessage).toBe('err');
    expect(component.showSuccessMessage).toBe(true);

    component.onSubmit();

    expect(component.form.get('comp').touched).toBe(true);
    expect(component.submitButtonDisabled).toBe(true);
    expect(component.errorMessage).toBe(null);
    expect(component.showSuccessMessage).toBe(false);
  });

  it('should handle error properly', () => {
    component.submitButtonDisabled = true;
    expect(component.submitButtonDisabled).toBe(true);

    component.handleError(
      new HttpErrorResponse({ status: 404, error: 'Not found' })
    );

    expect(component.submitButtonDisabled).toBe(false);
    expect(component.errorMessage).toBe('Not found');

    component.handleError(
      new HttpErrorResponse({ status: 500, error: 'Server error' })
    );
    expect(component.errorMessage).toBe('Generic error message');
  });
});
