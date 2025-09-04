"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
} from "../../../../component";
import { Plus, Trash2 } from "lucide-react";

interface SimCardTier {
  id: string;
  operadoras: string[];
  quantidadeMB: string;
  tipo: string;
  fornecedor: string;
}

interface SimCardPriceFormProps {
  onPriceChange?: (prices: any) => void;
}

const operadorasOptions = ["Tim", "Claro", "Vivo"];
const quantidadeMBOptions = ["10MB", "20MB", "30MB"];
const tipoOptions = ["Compartilhado", "Nao compartilhado"];
const fornecedorOptions = ["Arquia Mobile", "Emnify", "Links Field"];

export function SimCardPriceForm({ onPriceChange }: SimCardPriceFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [simCardTiers, setSimCardTiers] = useState<SimCardTier[]>([
    { 
      id: "1", 
      operadoras: [],
      quantidadeMB: "",
      tipo: "",
      fornecedor: ""
    },
  ]);

  const addSimCardTier = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }

    // Add new tier
    const newTier: SimCardTier = {
      id: Date.now().toString(),
      operadoras: [],
      quantidadeMB: "",
      tipo: "",
      fornecedor: "",
    };

    setSimCardTiers([...simCardTiers, newTier]);
  };

  const removeSimCardTier = (id: string) => {
    if (simCardTiers.length <= 1) return; // Keep at least 1 tier

    const filtered = simCardTiers.filter((tier) => tier.id !== id);
    setSimCardTiers(filtered);
  };

  const updateSimCardTier = (
    id: string,
    field: keyof SimCardTier,
    value: string | string[]
  ) => {
    setSimCardTiers((tiers) =>
      tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  // Notify parent component when prices change
  const handlePriceChange = () => {
    if (onPriceChange) {
      onPriceChange({
        simCardTiers,
      });
    }
  };

  return (
    <div className="space-y-6 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg text-gray-900">
        SIM Card - Venda Avulsa
      </h3>

      {!showForm ? (
        /* Initial Button */
        <Button
          variant="outline"
          onClick={addSimCardTier}
          className="w-full"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar configuração de SIM Card
        </Button>
      ) : (
        /* SIM Card Pricing Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuração de SIM Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
                            {/* SIM Card Tiers */}
              {simCardTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="flex flex-col gap-4 p-4 border rounded-lg"
                >
                  {/* SIM Card Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Operadora</Label>
                      <Combobox
                        data={operadorasOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="multiple"
                        value={tier.operadoras}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "operadoras", value);
                          handlePriceChange();
                        }}
                        placeholder="Selecione operadoras"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Quantidade MB</Label>
                      <Combobox
                        data={quantidadeMBOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.quantidadeMB ? [tier.quantidadeMB] : []}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "quantidadeMB", value[0] || "");
                          handlePriceChange();
                        }}
                        placeholder="Selecione quantidade"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Tipo</Label>
                      <Combobox
                        data={tipoOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.tipo ? [tier.tipo] : []}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "tipo", value[0] || "");
                          handlePriceChange();
                        }}
                        placeholder="Selecione tipo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Fornecedor</Label>
                      <Combobox
                        data={fornecedorOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.fornecedor ? [tier.fornecedor] : []}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "fornecedor", value[0] || "");
                          handlePriceChange();
                        }}
                        placeholder="Selecione fornecedor"
                      />
                    </div>
                  </div>

                  {/* Remove button for additional tiers */}
                  {simCardTiers.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSimCardTier(tier.id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Configuration Button */}
              <Button
                variant="outline"
                onClick={addSimCardTier}
                className="w-full"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar configuração
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
