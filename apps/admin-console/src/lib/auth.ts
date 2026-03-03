import { createSupabaseServer } from "./supabase-server";
import { createSupabaseService } from "./supabase-service";
import type { AdminRole } from "@f2k/shared";

export async function getAdminUser() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const service = createSupabaseService();
  const { data: adminUser } = await service
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return adminUser;
}

export function hasPermission(
  role: AdminRole,
  action: string
): boolean {
  const permissions: Record<string, AdminRole[]> = {
    view_investors: ["super_admin", "fund_manager", "compliance", "read_only"],
    approve_kyc: ["super_admin", "compliance"],
    manage_allowlist: ["super_admin", "fund_manager", "compliance"],
    confirm_subscriptions: ["super_admin", "fund_manager"],
    manage_nav: ["super_admin", "fund_manager"],
    create_distributions: ["super_admin", "fund_manager"],
    view_audit_log: ["super_admin", "fund_manager", "compliance", "read_only"],
    manage_admin_users: ["super_admin"],
  };

  return permissions[action]?.includes(role) ?? false;
}

export async function auditLog(
  actorId: string,
  actorEmail: string,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown> = {}
) {
  const service = createSupabaseService();
  await service.from("audit_log").insert({
    actor_id: actorId,
    actor_email: actorEmail,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}
