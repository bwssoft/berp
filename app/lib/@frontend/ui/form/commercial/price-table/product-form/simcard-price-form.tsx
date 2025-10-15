"use client";

import { useState } from "react";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Label } from '@/frontend/ui/component/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/ui/component/card';
import { Combobox } from '@/frontend/ui/component/combobox/index';

import { Plus, Trash2 } from "lucide-react";

interface SimCardTier {
  id: string;
  carriers: string[];
  dataMB: string;
  type: string;
  supplier: string;
  priceWithoutEquipment: string;
  priceInCombo: string;
}

interface SimCardPriceFormProps {
  onPriceChange?: (prices: any) => void;
  initialData?: Array<{
    carriers: string[];
    dataAmountMb: number;
    planType: string;
    provider: string;
    priceWithoutDevice: number;
    priceInBundle: number;
  }>;
}

const carriersOptions = ["Tim", "Claro", "Vivo"];
const dataMBOptions = ["10MB", "20MB", "30MB"];
const typeOptions = ["Compartilhado", "Nao compartilhado"];
const supplierOptions = ["Arquia Mobile", "Emnify", "Links Field"];

export function SimCardPriceForm({
  onPriceChange,
  initialData,
}: SimCardPriceFormProps) {
  const [showForm, setShowForm] = useState(
    !!initialData && initialData.length > 0
  );
  const [simCardTiers, setSimCardTiers] = useState<SimCardTier[]>(() => {
    if (initialData && initialData.length > 0) {
      return initialData.map((item, index) => ({
        id: (index + 1).toString(),
        carriers: item.carriers || [],
        dataMB: `${item.dataAmountMb}MB`,
        type: item.planType || "",
        supplier: item.provider || "",
        priceWithoutEquipment: item.priceWithoutDevice.toString(),
        priceInCombo: item.priceInBundle.toString(),
      }));
    }
    return [
      {
        id: "1",
        carriers: [],
        dataMB: "",
        type: "",
        supplier: "",
        priceWithoutEquipment: "",
        priceInCombo: "",
      },
    ];
  });

  const updateSimCardTier = (
    id: string,
    field: keyof SimCardTier,
    value: string | string[]
  ) => {
    setSimCardTiers((tiers) =>
      tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
    // Trigger price change notification after state update
    setTimeout(() => handlePriceChange(), 0);
  };

  const removeSimCardTier = (id: string) => {
    if (simCardTiers.length <= 1) return; // Keep at least 1 tier

    const filtered = simCardTiers.filter((tier) => tier.id !== id);
    setSimCardTiers(filtered);
    // Trigger price change notification after state update
    setTimeout(() => handlePriceChange(), 0);
  };

  const addSimCardTier = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }

    // Add new tier
    const newTier: SimCardTier = {
      id: Date.now().toString(),
      carriers: [],
      dataMB: "",
      type: "",
      supplier: "",
      priceWithoutEquipment: "",
      priceInCombo: "",
    };

    setSimCardTiers([...simCardTiers, newTier]);
    // Trigger price change notification after state update
    setTimeout(() => handlePriceChange(), 0);
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
            <CardTitle className="text-base">
              Configuração de SIM Cards
            </CardTitle>
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
                        data={carriersOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="multiple"
                        value={tier.carriers}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "carriers", value);
                        }}
                        placeholder="Selecione operadoras"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Quantidade MB</Label>
                      <Combobox
                        data={dataMBOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.dataMB ? [tier.dataMB] : []}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "dataMB", value[0] || "");
                        }}
                        placeholder="Selecione quantidade"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Tipo</Label>
                      <Combobox
                        data={typeOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.type ? [tier.type] : []}
                        onChange={(value) => {
                          updateSimCardTier(tier.id, "type", value[0] || "");
                        }}
                        placeholder="Selecione tipo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Fornecedor</Label>
                      <Combobox
                        data={supplierOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.supplier ? [tier.supplier] : []}
                        onChange={(value) => {
                          updateSimCardTier(
                            tier.id,
                            "supplier",
                            value[0] || ""
                          );
                        }}
                        placeholder="Selecione fornecedor"
                      />
                    </div>
                  </div>

                  {/* Price Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Preço sem equipamento</Label>
                      <Input
                        value={tier.priceWithoutEquipment}
                        onChange={(e) => {
                          updateSimCardTier(
                            tier.id,
                            "priceWithoutEquipment",
                            e.target.value
                          );
                        }}
                        placeholder="R$ 0,00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Preço no combo</Label>
                      <Input
                        value={tier.priceInCombo}
                        onChange={(e) => {
                          updateSimCardTier(
                            tier.id,
                            "priceInCombo",
                            e.target.value
                          );
                        }}
                        placeholder="R$ 0,00"
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
