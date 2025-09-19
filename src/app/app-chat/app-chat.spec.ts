import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppChat } from './app-chat';

describe('AppChat', () => {
  let component: AppChat;
  let fixture: ComponentFixture<AppChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
