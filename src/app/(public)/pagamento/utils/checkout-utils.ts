const prices = {
  "Ouro Insights": {
    "Até 50": 1.5,
    "51-100": 449.9,
    "101-150": 499.9,
    "151-200": 559.9,
  },
  "Diamante Analytics": {
    "Até 50": 499.0,
    "51-100": 559.9,
    "101-150": 619.9,
    "151-200": 689.9,
  },
  "Platina Vision": {
    "Até 50": 599.0,
    "51-100": 669.9,
    "101-150": 739.9,
    "151-200": 821.9,
  },
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function calculatePrice(
  planName: string,
  employeeCount: string
): number {
  const plan = prices[planName as keyof typeof prices];

  if (!plan) {
    throw new Error(`Plano inválido: ${planName}`);
  }

  const price = plan[employeeCount as keyof typeof plan];

  if (price === undefined) {
    throw new Error(`Faixa de funcionários inválida: ${employeeCount}`);
  }

  return price;
}

export function calculateSavings(monthlyPrice: number): number {
  const annualPrice = monthlyPrice * 10;
  const regularAnnualPrice = monthlyPrice * 12;
  return regularAnnualPrice - annualPrice;
}

export function formatCNPJ(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export function formatCEP(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
}

export function formatPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

export function formatMobilePhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})\d+?$/, "$1");
}

export function formatExpiryDate(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\/\d{2})\d+?$/, "$1");
}

export async function fetchAddressByCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    console.error("Erro ao consultar CEP:", error);
    return null;
  }
}

export function getPlanBadgeColors(plan: string): {
  bg: string;
  text: string;
  icon: string;
} {
  switch (plan) {
    case "Ouro Insights":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: "text-amber-500",
      };
    case "Platina Vision":
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        icon: "text-slate-500",
      };
    case "Diamante Analytics":
      return {
        bg: "bg-sky-100",
        text: "text-sky-700",
        icon: "text-sky-500",
      };
    default:
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: "text-amber-500",
      };
  }
}

export function isValidCNPJ(value: string): boolean {
  const cnpj = value.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcDigit = (base: string, weights: number[]) => {
    const sum = base
      .split("")
      .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * weights[idx], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = cnpj.slice(0, 12);
  const digit1 = calcDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digit2 = calcDigit(
    base + digit1,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return cnpj === base + digit1.toString() + digit2.toString();
}
