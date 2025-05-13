import { TestBed } from '@angular/core/testing';

import { TokenSetPasswordInterceptor } from './token.set-password.interceptor';

describe('TokenSetPasswordInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenSetPasswordInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenSetPasswordInterceptor = TestBed.inject(TokenSetPasswordInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
