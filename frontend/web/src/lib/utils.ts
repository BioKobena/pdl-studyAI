// src/lib/utils.ts
export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}
