"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Label } from '@/frontend/ui/component/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/ui/component/card';
import { Toggle } from '@/frontend/ui/component/toggle';

import { Plus, Trash2 } from "lucide-react";

interface PriceTier {
  id: string;
  from: string;
  to: string;
  pricePerUnit: string;
  isLast?: boolean;
}

interface EquipmentPriceFormProps {
  equipmentModel: string;
  onPriceChange?: (prices: any) => void;
  initialData?: {
    creditPayment?: {
      type: "batch" | "unit";
      paymentType: "credit" | "upfront";
      unitPrice: number;
      priceRange: Array<{ from: number; to: number; unitPrice: number }>;
    };
    upfrontPayment?: {
      type: "batch" | "unit";
      paymentType: "credit" | "upfront";
      unitPrice: number;
      priceRange: Array<{ from: number; to: number; unitPrice: number }>;
    };
  };
}

export function EquipmentAccessoryPriceForm({
  equipmentModel,
  onPriceChange,
  initialData,
}: EquipmentPriceFormProps) {
  const [useQuantityRange, setUseQuantityRange] = useState(
    initialData?.creditPayment
      ? initialData.creditPayment.type === "batch" ||
          initialData.creditPayment.priceRange.length > 0
      : false
  );
  const [useCashQuantityRange, setUseCashQuantityRange] = useState(
    // For batch type, cash payment should also use quantity ranges by default
    initialData?.upfrontPayment
      ? initialData.upfrontPayment.type === "batch"
      : false
  );
  const [singlePrice, setSinglePrice] = useState(
    initialData?.creditPayment &&
      initialData.creditPayment.type === "unit" &&
      initialData.creditPayment.priceRange.length === 0
      ? initialData.creditPayment.unitPrice.toString()
      : ""
  );
  const [cashPrice, setCashPrice] = useState(
    initialData?.upfrontPayment &&
      initialData.upfrontPayment.type === "unit" &&
      initialData.upfrontPayment.priceRange.length === 0
      ? initialData.upfrontPayment.unitPrice.toString()
      : ""
  );
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>(() => {
    if (
      initialData?.creditPayment &&
      initialData.creditPayment.priceRange.length > 0
    ) {
      // Map existing price range data to tier format
      const tiers = initialData.creditPayment.priceRange.map(
        (range, index) => ({
          id: (index + 1).toString(),
          from: range.from.toString(),
          to: range.to.toString(),
          pricePerUnit: range.unitPrice.toString(),
          isLast: index === initialData.creditPayment!.priceRange.length - 1,
        })
      );
      return tiers;
    } else if (
      initialData?.creditPayment &&
      initialData.creditPayment.type === "batch"
    ) {
      // If type is batch but no existing price ranges, start with default tiers
      return [
        { id: "1", from: "", to: "", pricePerUnit: "" },
        { id: "2", from: "", to: "", pricePerUnit: "", isLast: true },
      ];
    }
    return [
      { id: "1", from: "", to: "", pricePerUnit: "" },
      { id: "2", from: "", to: "", pricePerUnit: "", isLast: true },
    ];
  });
  const [cashPriceTiers, setCashPriceTiers] = useState<PriceTier[]>(() => {
    if (
      initialData?.upfrontPayment &&
      initialData.upfrontPayment.priceRange.length > 0
    ) {
      return initialData.upfrontPayment.priceRange.map((range, index) => ({
        id: (index + 1).toString(),
        from: range.from.toString(),
        to: range.to.toString(),
        pricePerUnit: range.unitPrice.toString(),
        isLast: index === initialData.upfrontPayment!.priceRange.length - 1,
      }));
    } else if (
      initialData?.upfrontPayment &&
      initialData.upfrontPayment.type === "batch"
    ) {
      return [
        { id: "1", from: "", to: "", pricePerUnit: "" },
        { id: "2", from: "", to: "", pricePerUnit: "", isLast: true },
      ];
    }

    return [
      { id: "1", from: "", to: "", pricePerUnit: "" },
      { id: "2", from: "", to: "", pricePerUnit: "", isLast: true },
    ];
  });

  const addPriceTier = () => {
    // Remove isLast from current last tier and add new regular tier
    const updatedTiers = priceTiers.map((tier, index) =>
      index === priceTiers.length - 1 ? { ...tier, isLast: false } : tier
    );

    // Add new tier before the last one
    const newTier: PriceTier = {
      id: Date.now().toString(),
      from: "",
      to: "",
      pricePerUnit: "",
    };

    // Update the last tier to be the new last tier
    const lastTier = { ...updatedTiers[updatedTiers.length - 1] };
    updatedTiers[updatedTiers.length - 1] = newTier;
    lastTier.isLast = true;

    setPriceTiers([...updatedTiers, lastTier]);
  };

  const addCashPriceTier = () => {
    // Remove isLast from current last tier and add new regular tier
    const updatedTiers = cashPriceTiers.map((tier, index) =>
      index === cashPriceTiers.length - 1 ? { ...tier, isLast: false } : tier
    );

    // Add new tier before the last one
    const newTier: PriceTier = {
      id: Date.now().toString(),
      from: "",
      to: "",
      pricePerUnit: "",
    };

    // Update the last tier to be the new last tier
    const lastTier = { ...updatedTiers[updatedTiers.length - 1] };
    updatedTiers[updatedTiers.length - 1] = newTier;
    lastTier.isLast = true;

    setCashPriceTiers([...updatedTiers, lastTier]);
  };

  const removePriceTier = (id: string) => {
    if (priceTiers.length <= 2) return; // Keep at least 2 tiers

    const filtered = priceTiers.filter((tier) => tier.id !== id);
    // Ensure the last tier has isLast = true
    if (filtered.length > 0) {
      filtered[filtered.length - 1].isLast = true;
    }
    setPriceTiers(filtered);
  };

  const removeCashPriceTier = (id: string) => {
    if (cashPriceTiers.length <= 2) return; // Keep at least 2 tiers

    const filtered = cashPriceTiers.filter((tier) => tier.id !== id);
    // Ensure the last tier has isLast = true
    if (filtered.length > 0) {
      filtered[filtered.length - 1].isLast = true;
    }
    setCashPriceTiers(filtered);
  };

  const updatePriceTier = (
    id: string,
    field: keyof PriceTier,
    value: string
  ) => {
    setPriceTiers((tiers) =>
      tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  const updateCashPriceTier = (
    id: string,
    field: keyof PriceTier,
    value: string
  ) => {
    setCashPriceTiers((tiers) =>
      tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  // Notify parent component when prices change
  const handlePriceChange = useCallback(() => {
    if (onPriceChange) {
      onPriceChange({
        equipmentModel,
        useQuantityRange,
        useCashQuantityRange,
        singlePrice,
        cashPrice,
        priceTiers: useQuantityRange ? priceTiers : [],
        cashPriceTiers: useCashQuantityRange ? cashPriceTiers : [],
      });
    }
  }, [
    onPriceChange,
    equipmentModel,
    useQuantityRange,
    useCashQuantityRange,
    singlePrice,
    cashPrice,
    priceTiers,
    cashPriceTiers,
  ]);

  // Initialize with existing data on mount
  useEffect(() => {
    if (initialData) {
      handlePriceChange();
    }
  }, [initialData, handlePriceChange]);

  return (
    <div className="space-y-6 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg text-gray-900">{equipmentModel}</h3>

      {/* Payment on Credit Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pagamento a prazo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quantity Range Toggle */}
          <div className="flex items-center space-x-3">
            <Toggle
              value={useQuantityRange}
              onChange={(checked) => {
                if (initialData?.creditPayment?.type === "batch" && !checked)
                  return;
                setUseQuantityRange(checked);
                handlePriceChange();
              }}
              disabled={initialData?.creditPayment?.type === "batch"}
              title={() =>
                initialData?.creditPayment?.type === "batch"
                  ? "Faixa de quantidade (obrigatório para tipo lote)"
                  : "Faixa de quantidade"
              }
            />
            <Label className="text-sm font-medium">Faixa de quantidade</Label>
          </div>

          {useQuantityRange ? (
            <div className="space-y-4">
              {/* Price Tiers */}
              {priceTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="flex items-end gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm">
                      {tier.isLast ? "A partir de:" : "De:"}
                    </Label>
                    <Input
                      value={tier.from}
                      onChange={(e) => {
                        updatePriceTier(tier.id, "from", e.target.value);
                        handlePriceChange();
                      }}
                      placeholder="0"
                    />
                  </div>

                  {!tier.isLast && (
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm">Até:</Label>
                      <Input
                        value={tier.to}
                        onChange={(e) => {
                          updatePriceTier(tier.id, "to", e.target.value);
                          handlePriceChange();
                        }}
                        placeholder="0"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <Label className="text-sm">Preço por unidade</Label>
                    <Input
                      value={tier.pricePerUnit}
                      onChange={(e) => {
                        updatePriceTier(
                          tier.id,
                          "pricePerUnit",
                          e.target.value
                        );
                        handlePriceChange();
                      }}
                      placeholder="R$ 0,00"
                    />
                  </div>

                  {!tier.isLast && priceTiers.length > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removePriceTier(tier.id)}
                      className="mb-0"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {/* Add New Tier Button */}
              <Button
                variant="outline"
                onClick={addPriceTier}
                className="w-full"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar faixa de quantidade
              </Button>
            </div>
          ) : (
            /* Single Price Input */
            <div className="space-y-2">
              <Label className="text-sm">Preço por unidade</Label>
              <Input
                value={singlePrice}
                onChange={(e) => {
                  setSinglePrice(e.target.value);
                  handlePriceChange();
                }}
                placeholder="R$ 0,00"
                className="max-w-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment in Cash Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pagamento à vista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quantity Range Toggle for Cash */}
          <div className="flex items-center space-x-3">
            <Toggle
              value={useCashQuantityRange}
              onChange={(checked) => {
                if (initialData?.upfrontPayment?.type === "batch" && !checked)
                  return;
                setUseCashQuantityRange(checked);
                handlePriceChange();
              }}
              disabled={initialData?.upfrontPayment?.type === "batch"}
              title={() =>
                initialData?.upfrontPayment?.type === "batch"
                  ? "Faixa de quantidade (obrigatório para tipo lote)"
                  : "Faixa de quantidade"
              }
            />
            <Label className="text-sm font-medium">Faixa de quantidade</Label>
          </div>

          {useCashQuantityRange ? (
            <div className="space-y-4">
              {/* Cash Price Tiers */}
              {cashPriceTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="flex items-end gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm">
                      {tier.isLast ? "A partir de:" : "De:"}
                    </Label>
                    <Input
                      value={tier.from}
                      onChange={(e) => {
                        updateCashPriceTier(tier.id, "from", e.target.value);
                        handlePriceChange();
                      }}
                      placeholder="0"
                    />
                  </div>

                  {!tier.isLast && (
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm">Até:</Label>
                      <Input
                        value={tier.to}
                        onChange={(e) => {
                          updateCashPriceTier(tier.id, "to", e.target.value);
                          handlePriceChange();
                        }}
                        placeholder="0"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <Label className="text-sm">Preço por unidade</Label>
                    <Input
                      value={tier.pricePerUnit}
                      onChange={(e) => {
                        updateCashPriceTier(
                          tier.id,
                          "pricePerUnit",
                          e.target.value
                        );
                        handlePriceChange();
                      }}
                      placeholder="R$ 0,00"
                    />
                  </div>

                  {!tier.isLast && cashPriceTiers.length > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeCashPriceTier(tier.id)}
                      className="mb-0"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {/* Add New Cash Tier Button */}
              <Button
                variant="outline"
                onClick={addCashPriceTier}
                className="w-full"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar faixa de quantidade
              </Button>
            </div>
          ) : (
            /* Single Cash Price Input */
            <div className="space-y-2">
              <Label className="text-sm">Preço por unidade</Label>
              <Input
                value={cashPrice}
                onChange={(e) => {
                  setCashPrice(e.target.value);
                  handlePriceChange();
                }}
                placeholder="R$ 0,00"
                className="max-w-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
