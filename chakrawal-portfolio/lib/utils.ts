type ClassValue = string | number | boolean | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  const append = (value: ClassValue): void => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(append);
      return;
    }
    classes.push(String(value));
  };

  inputs.forEach(append);
  return classes.join(" ");
}
