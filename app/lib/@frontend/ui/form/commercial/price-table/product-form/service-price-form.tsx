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

interface ServiceTier {
  id: string;
  service: string;
  monthlyPrice: string;
  annualPrice: string;
  fixedPrice: string;
}

interface ServicePriceFormProps {
  onPriceChange?: (prices: any) => void;
}

const serviceOptions = [
  "Monitoramento GPS",
  "Plataforma de Telemetria",
  "Relatórios Avançados",
  "Suporte Técnico 24h",
  "Backup de Dados",
  "API de Integração",
  "Dashboard Personalizado",
];

export function ServicePriceForm({ onPriceChange }: ServicePriceFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([
    {
      id: "1",
      service: "",
      monthlyPrice: "",
      annualPrice: "",
      fixedPrice: "",
    },
  ]);

  const addServiceTier = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }

    // Add new tier
    const newTier: ServiceTier = {
      id: Date.now().toString(),
      service: "",
      monthlyPrice: "",
      annualPrice: "",
      fixedPrice: "",
    };

    const updatedTiers = [...serviceTiers, newTier];
    setServiceTiers(updatedTiers);

    // Notify parent about the new tier
    if (onPriceChange) {
      onPriceChange(updatedTiers);
    }
  };

  const removeServiceTier = (id: string) => {
    if (serviceTiers.length <= 1) return; // Keep at least 1 tier

    const updatedTiers = serviceTiers.filter((tier) => tier.id !== id);
    setServiceTiers(updatedTiers);

    // Notify parent about tier removal
    if (onPriceChange) {
      onPriceChange(updatedTiers);
    }
  };

  const updateServiceTier = (
    id: string,
    field: keyof ServiceTier,
    value: string
  ) => {
    const updatedTiers = serviceTiers.map((tier) =>
      tier.id === id ? { ...tier, [field]: value } : tier
    );
    setServiceTiers(updatedTiers);

    // Automatically notify parent about price changes
    if (onPriceChange) {
      onPriceChange(updatedTiers);
    }
  };

  return (
    <div className="space-y-6 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg text-gray-900">Serviços</h3>

      {!showForm ? (
        /* Initial Button */
        <Button
          variant="outline"
          onClick={addServiceTier}
          className="w-full"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar configuração
        </Button>
      ) : (
        /* Service Pricing Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Configuração de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Service Tiers */}
              {serviceTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="flex flex-col gap-4 p-4 border rounded-lg"
                >
                  {/* Service Configuration */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Serviço</Label>
                      <Combobox
                        data={serviceOptions}
                        keyExtractor={(item) => item}
                        displayValueGetter={(item) => item}
                        type="single"
                        value={tier.service ? [tier.service] : []}
                        onChange={(value) => {
                          updateServiceTier(tier.id, "service", value[0] || "");
                          // Removed duplicate handlePriceChange() - now handled by updateServiceTier
                        }}
                        placeholder="Selecione um serviço"
                      />
                    </div>
                  </div>

                  {/* Price Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Preço mensal</Label>
                      <Input
                        value={tier.monthlyPrice}
                        onChange={(e) => {
                          updateServiceTier(
                            tier.id,
                            "monthlyPrice",
                            e.target.value
                          );
                          // Removed duplicate handlePriceChange() - now handled by updateServiceTier
                        }}
                        placeholder="R$ 0,00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Preço anual</Label>
                      <Input
                        value={tier.annualPrice}
                        onChange={(e) => {
                          updateServiceTier(
                            tier.id,
                            "annualPrice",
                            e.target.value
                          );
                          // Removed duplicate handlePriceChange() - now handled by updateServiceTier
                        }}
                        placeholder="R$ 0,00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Preço fixo</Label>
                      <Input
                        value={tier.fixedPrice}
                        onChange={(e) => {
                          updateServiceTier(
                            tier.id,
                            "fixedPrice",
                            e.target.value
                          );
                          // Removed duplicate handlePriceChange() - now handled by updateServiceTier
                        }}
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>

                  {/* Remove button for additional tiers */}
                  {serviceTiers.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeServiceTier(tier.id)}
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
                onClick={addServiceTier}
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
