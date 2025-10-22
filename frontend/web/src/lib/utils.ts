// src/lib/utils.ts
export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}
export function generateUniqueId(prefix = ''): string {
    return prefix + crypto.randomUUID();
}


