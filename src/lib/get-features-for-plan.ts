const baseFeatures = [
  { name: "Demitidos", available: true },
  { name: "Faltas", available: true },
  { name: "Atestados", available: true },
  { name: "Acidentes", available: true },
  { name: "Advertências", available: true },
  { name: "Status do Trabalhador", available: true },
  { name: "Aniversariantes", available: false },
  { name: "EPI", available: false },
  { name: "Ficha Cadastral", available: false },
  { name: "Folha", available: false },
];

export const getFeaturesForPlan = (planIndex: number) => {
  if (planIndex === 0) {
    return baseFeatures;
  } else if (planIndex === 1) {
    return baseFeatures.map((feature) => {
      if (
        feature.name === "Aniversariantes" ||
        feature.name === "EPI" ||
        feature.name === "Ficha Cadastral"
      ) {
        return { ...feature, available: true };
      }
      return feature;
    });
  } else {
    return baseFeatures.map((feature) => ({ ...feature, available: true }));
  }
};
