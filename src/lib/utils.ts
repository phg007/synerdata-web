import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDocument(value: string) {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
}

export function formatCardNumber(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2");
}

export function formatExpiryDate(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{2})(\d)/, "$1/$2");
}

export function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
}

export function formatZipcode(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{5})(\d)/, "$1-$2");
}

export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

export const formatRG = (rg: string): string => {
  const cleaned = rg.replace(/\D/g, "");
  if (cleaned.length <= 9) {
    const match = cleaned.match(/^(\d{1,2})(\d{3})(\d{3})(\d{1})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
  }
  return rg;
};

export const formatPIS = (pis: string): string => {
  const cleaned = pis.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{5})(\d{2})(\d{1})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return pis;
};

export const formatCTPS = (ctps: string): string => {
  const cleaned = ctps.replace(/\D/g, "");
  return cleaned.slice(0, 7);
};

export const formatHeight = (height: string): string => {
  const cleaned = height.replace(/\D/g, "");
  if (cleaned.length >= 3) {
    const meters = cleaned.slice(0, 1);
    const centimeters = cleaned.slice(1, 3);
    return `${meters}.${centimeters}`;
  }
  return height;
};

export const formatWeight = (weight: string): string => {
  const cleaned = weight.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    const kg = cleaned.slice(0, -1) || "0";
    const grams = cleaned.slice(-1);
    return `${kg}.${grams}`;
  }
  return weight;
};

export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleaned.charAt(i)) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number.parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleaned.charAt(i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number.parseInt(cleaned.charAt(10))) return false;

  return true;
};
