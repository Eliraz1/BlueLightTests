import { Role } from './permissions-matrix';

export interface TestUser {
  username: string;
  password: string;
}

/**
 * מומלץ למשוך מ-.env / משתני סביבה של ה-CI ולא לשמור סיסמאות בקוד.
 * זה placeholder בלבד - להחליף בפרטי המשתמשים האמיתיים בסביבת ה-Staging.
 */
export const testUsers: Record<Role, TestUser> = {
  operator: {
    username: process.env.TEST_OPERATOR_USER ?? 'operator_test',
    password: process.env.TEST_OPERATOR_PASS ?? '',
  },
  admin: {
    username: process.env.TEST_ADMIN_USER ?? 'admin_test',
    password: process.env.TEST_ADMIN_PASS ?? '',
  },
  securityOfficer: {
    username: process.env.TEST_SECURITY_USER ?? 'security_test',
    password: process.env.TEST_SECURITY_PASS ?? '',
  },
};
