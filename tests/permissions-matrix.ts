/**
 * permissions-matrix.ts
 *
 * מקור אמת יחיד להרשאות במערכת, לפי הטבלה שסופקה.
 * כל שינוי בהרשאות במערכת האמיתית → מעדכנים כאן בלבד,
 * ובדיקות ה-E2E מתעדכנות אוטומטית.
 */

export type Role = 'operator' | 'admin' | 'securityOfficer';

export const ROLE_LABELS: Record<Role, string> = {
  operator: 'Operator (משתמש)',
  admin: 'Admin (מנהל)',
  securityOfficer: 'Security Officer (קצין ביטחון)',
};

// RW = Read/Write | RO = Read Only | DISABLED = לא זמין / מוסתר
export type PermissionLevel = 'RW' | 'RO' | 'DISABLED';

export interface ModulePermissions {
  operator: PermissionLevel;
  admin: PermissionLevel;
  securityOfficer: PermissionLevel;
  /** נתיב ה-URL של המודול, לבדיקת גישה ישירה (bypass של התפריט) */
  url: string;
  /**
   * טקסט ייחודי שמוכיח שהמסך הנכון נטען (למשל כותרת העמוד).
   * נבדק עם getByText().
   */
  screenIdentifierText: string;
  /**
   * סלקטור CSS של כפתור/פעולת העריכה העיקרית במסך (למשל aria-label).
   * אם למודול אין פעולת עריכה יחידה ברורה - יש לעדכן ידנית מול האתר.
   */
  editSelector: string;
  /**
   * true אם כפתור העריכה דורש בחירת שורה/רשומה בטבלה קודם
   * (למשל: לוחצים על checkbox ליד רשומה, ורק אז כפתור העריכה הופך רלוונטי).
   */
  requiresRowSelection?: boolean;
}

export const permissionsMatrix: Record<string, ModulePermissions> = {
  'Channels': {
    operator: 'RO', admin: 'RW', securityOfficer: 'RO',
    url: '/Channels',
    screenIdentifierText: 'ערוצים',
    editSelector: 'text="עריכה"',
    requiresRowSelection: true,
  },
  'Dashboard': {
    operator: 'RW', admin: 'RW', securityOfficer: 'RW',
    url: '/Home',
    screenIdentifierText: 'בית',
    editSelector: 'text="ערוך לוח"',
    requiresRowSelection: false,
  },
  // 'Recordings': {
  //   operator: 'RO', admin: 'RW', securityOfficer: 'RO',
  //   url: '/Recordings',
  //   screenIdentifierText: 'הקלטות',
  //   editSelector: 'text="מחיקה"',  //לשנות את הכפתור שיהיה מותאם 
  //   requiresRowSelection: false,
  // },
  // שאר המודולים - עדיין עם ניחושים, לעדכן אחד-אחד באותה שיטה:
  // 'Recordings':                { operator: 'RO',       admin: 'RW',       securityOfficer: 'RO',       url: '/recordings', screenIdentifierText: 'הקלטות', editSelector: 'TODO' },
  'Protected Records':         { operator: 'DISABLED', admin: 'DISABLED', securityOfficer: 'RW',       url: '/protected-records', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Investigation Platform':    { operator: 'RW',       admin: 'RW',       securityOfficer: 'RW',       url: '/investigation', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Downloads':                 { operator: 'RW',       admin: 'RW',       securityOfficer: 'RW',       url: '/downloads', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Favorites':                 { operator: 'RW',       admin: 'RW',       securityOfficer: 'RW',       url: '/favorites', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Alerts':                    { operator: 'RO',       admin: 'RO',       securityOfficer: 'RO',       url: '/alerts', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Settings - General':        { operator: 'RW',       admin: 'RW',       securityOfficer: 'RO',       url: '/settings/general', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Settings - Storage':        { operator: 'DISABLED', admin: 'RW',       securityOfficer: 'DISABLED', url: '/settings/storage', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Settings - Users':          { operator: 'DISABLED', admin: 'RW',       securityOfficer: 'DISABLED', url: '/settings/users', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Settings - Interfaces':     { operator: 'DISABLED', admin: 'RW',       securityOfficer: 'DISABLED', url: '/settings/interfaces', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Settings - AD':             { operator: 'DISABLED', admin: 'RW',       securityOfficer: 'DISABLED', url: '/settings/ad', screenIdentifierText: 'TODO', editSelector: 'TODO' },
  'Settings - Recording Site': { operator: 'DISABLED', admin: 'RW',       securityOfficer: 'DISABLED', url: '/settings/recording-site', screenIdentifierText: 'TODO', editSelector: 'TODO' },
};

/** מודולים שכבר אומתו מול האתר האמיתי - להרצה ממוקדת בזמן שממשיכים למפות את השאר */
export const VERIFIED_MODULES = ['Channels', 'Dashboard'];

export const ALL_ROLES: Role[] = ['operator', 'admin', 'securityOfficer'];
export const ALL_MODULES = Object.keys(permissionsMatrix);
