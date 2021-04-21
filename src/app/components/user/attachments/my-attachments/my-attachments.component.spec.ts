import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAttachmentsComponent } from './my-attachments.component';

describe('MyAttachmentsComponent', () => {
  let component: MyAttachmentsComponent;
  let fixture: ComponentFixture<MyAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
