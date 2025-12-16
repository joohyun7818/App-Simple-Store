import type { User } from "../types";

type UserAttributeValue = string | number | boolean | null;
type UserAttributes = Record<string, UserAttributeValue>;
type UserInfo = {
  id: string;
  attributes?: UserAttributes;
};

function fnv1a32(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function toOptimizelyUser(authUser: User | null): UserInfo {
  if (!authUser) {
    return {
      id: "anonymous",
      attributes: {
        is_logged_in: false,
      },
    };
  }

  const email = (authUser.email ?? "").trim().toLowerCase();
  const emailDomain = email.includes("@") ? email.split("@")[1] : undefined;

  const id = `uid_${fnv1a32(email || authUser.name || "unknown")}`;

  const attributes: UserAttributes = {
    is_logged_in: true,
    $opt_bucketing_id: id,
  };

  if (emailDomain) attributes.email_domain = emailDomain;
  if (authUser.country) attributes.country = authUser.country;

  return { id, attributes };
}
