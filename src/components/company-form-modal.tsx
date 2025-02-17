import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

type CompanyFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (company: Company) => void;
};

export type Company = {
  id: string;
  fantasyName: string;
  legalName: string;
  cnpj: string;
  address: string;
  phone: string;
  additionalData: string;
  taxRegime: string;
  cnae: string;
  segment: string;
  logo: File | null;
  sectors: string;
  branches: string;
  costCenters: string;
  ppEs: string;
};

export function CompanyFormModal({
  isOpen,
  onClose,
  onAddCompany,
}: CompanyFormModalProps) {
  const [fantasyName, setFantasyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalData, setAdditionalData] = useState("");
  const [taxRegime, setTaxRegime] = useState("");
  const [cnae, setCnae] = useState("");
  const [segment, setSegment] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [sectors, setSectors] = useState("");
  const [branches, setBranches] = useState("");
  const [costCenters, setCostCenters] = useState("");
  const [ppEs, setPPEs] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fantasyName ||
      !legalName ||
      !cnpj ||
      !address ||
      !phone ||
      !taxRegime ||
      !cnae ||
      !segment
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newCompany: Company = {
      id: Date.now().toString(),
      fantasyName,
      legalName,
      cnpj,
      address,
      phone,
      additionalData,
      taxRegime,
      cnae,
      segment,
      logo,
      sectors,
      branches,
      costCenters,
      ppEs,
    };

    onAddCompany(newCompany);
    toast({
      title: "Empresa adicionada com sucesso",
      description: "O cadastro foi confirmado.",
    });
    onClose();
    // Reset form
    setFantasyName("");
    setLegalName("");
    setCnpj("");
    setAddress("");
    setPhone("");
    setAdditionalData("");
    setTaxRegime("");
    setCnae("");
    setSegment("");
    setLogo(null);
    setSectors("");
    setBranches("");
    setCostCenters("");
    setPPEs("");
  };
  const { toast } = useToast();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Empresa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar uma nova empresa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fantasyName">Nome fantasia</Label>
              <Input
                id="fantasyName"
                value={fantasyName}
                onChange={(e) => setFantasyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão social</Label>
              <Input
                id="legalName"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalData">Dados complementares</Label>
            <Textarea
              id="additionalData"
              value={additionalData}
              onChange={(e) => setAdditionalData(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRegime">Regime tributário</Label>
              <Select value={taxRegime} onValueChange={setTaxRegime} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="lucro_presumido">
                    Lucro Presumido
                  </SelectItem>
                  <SelectItem value="lucro_real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnae">CNAE</Label>
              <Input
                id="cnae"
                value={cnae}
                onChange={(e) => setCnae(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="segment">Segmento</Label>
            <Input
              id="segment"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo da empresa</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectors">Setores</Label>
            <Input
              id="sectors"
              value={sectors}
              onChange={(e) => setSectors(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branches">Filiais</Label>
            <Input
              id="branches"
              value={branches}
              onChange={(e) => setBranches(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costCenters">Centros de custo</Label>
            <Input
              id="costCenters"
              value={costCenters}
              onChange={(e) => setCostCenters(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppes">EPIs</Label>
            <Input
              id="ppes"
              value={ppEs}
              onChange={(e) => setPPEs(e.target.value)}
            />
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
