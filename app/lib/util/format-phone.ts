// lib/@frontend/ui/component/utils/maskPhone.ts
export function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const len = digits.length;
    if (len <= 2) {
        return digits;
    }
    const ddd = digits.slice(0, 2);
    if (len <= 6) {
        const part = digits.slice(2);
        return `(${ddd}) ${part}`;
    }
    if (len <= 10) {
        const part1 = digits.slice(2, 6);
        const part2 = digits.slice(6);
        return `(${ddd}) ${part1}-${part2}`;
    }
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7);
    return `(${ddd}) ${part1}-${part2}`;
}
