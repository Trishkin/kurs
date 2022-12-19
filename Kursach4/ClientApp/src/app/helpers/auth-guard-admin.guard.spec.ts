import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuardAdminGuard } from './auth-guard-admin.guard';

describe('AuthGuardAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardAdminGuard]
    });
  });

  it('should ...', inject([AuthGuardAdminGuard], (guard: AuthGuardAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
