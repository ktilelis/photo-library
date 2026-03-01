import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getElementByLocator } from '@testing/test-locator-helper';
import { MessageArea } from './message-area';

describe('MessageArea', () => {
  let component: MessageArea;
  let fixture: ComponentFixture<MessageArea>;
  const message = 'my message';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageArea]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageArea);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', message);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the message area and the message text', () => {
    const messageAreaElement = getElementByLocator<MessageArea>(fixture, 'message-area');
    const messageElement = getElementByLocator<MessageArea>(fixture, 'message');

    expect(messageAreaElement).toBeTruthy();
    expect(messageElement).toBeTruthy();
    expect(messageElement?.textContent?.trim()).toBe(message);
  });

  it('should update rendered text when message input changes', async () => {
    const updatedMessage = 'my updated message';

    fixture.componentRef.setInput('message', updatedMessage);
    fixture.detectChanges();
    await fixture.whenStable();

    const messageElement = getElementByLocator<MessageArea>(fixture, 'message');

    expect(messageElement?.textContent?.trim()).toBe(updatedMessage);
  });
});
