import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveUserLeaveComponent } from './approve-user-leaves.component';

describe('MyleaveComponent', () => {
  let component: ApproveUserLeaveComponent;
  let fixture: ComponentFixture<ApproveUserLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveUserLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveUserLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
