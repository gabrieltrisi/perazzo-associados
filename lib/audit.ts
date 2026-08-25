import 'server-only';
import { prisma } from './db';

// Trilha de auditoria. Nunca deixa a auditoria derrubar a ação principal.
export async function registrarAudit(userEmail: string, action: string, detail = '', ip = ''): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: { userEmail: userEmail.slice(0, 200), action: action.slice(0, 120), detail: detail.slice(0, 500), ip: ip.slice(0, 60) },
    });
  } catch {
    /* ignora — auditoria é best-effort */
  }
}
