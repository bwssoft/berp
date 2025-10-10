"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Toggle,
} from "../../../../component";
import { PriceTier, PriceTierInput } from "./price-tier-input";

type PriceRange = { from: number; to: number; unitPrice: number };

const toPriceTiers = (
  priceRange?: PriceRange[]
): PriceTier[] | undefined => {
  if (!priceRange || priceRange.length === 0) {
    return undefined;
  }

  return priceRange.map(({ from, to, unitPrice }) => ({
    from,
    to,
    unitPrice,
  }));
};

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
  const creditInitialPriceRange = initialData?.creditPayment?.priceRange;
  const cashInitialPriceRange = initialData?.upfrontPayment?.priceRange;

  const creditInitialTiers = useMemo(
    () => toPriceTiers(creditInitialPriceRange),
    [creditInitialPriceRange]
  );

  const cashInitialTiers = useMemo(
    () => toPriceTiers(cashInitialPriceRange),
    [cashInitialPriceRange]
  );

  const [priceTiers, setPriceTiers] = useState<PriceTier[] | undefined>(
    creditInitialTiers
  );
  const [cashPriceTiers, setCashPriceTiers] = useState<PriceTier[] | undefined>(
    cashInitialTiers
  );

  useEffect(() => {
    setPriceTiers(creditInitialTiers);
  }, [creditInitialTiers]);

  useEffect(() => {
    setCashPriceTiers(cashInitialTiers);
  }, [cashInitialTiers]);

  // Notify parent component when prices change
  const handlePriceChange = useCallback(() => {
    if (onPriceChange) {
      onPriceChange({
        equipmentModel,
        useQuantityRange,
        useCashQuantityRange,
        singlePrice,
        cashPrice,
        priceTiers: useQuantityRange && priceTiers ? priceTiers : [],
        cashPriceTiers:
          useCashQuantityRange && cashPriceTiers ? cashPriceTiers : [],
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

  useEffect(() => {
    handlePriceChange();
  }, [handlePriceChange]);

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
            <PriceTierInput
              initialTiers={priceTiers ?? creditInitialTiers}
              onValidChange={(tiers) => {
                setPriceTiers(tiers);
              }}
            />
          ) : (
            /* Single Price Input */
            <div className="space-y-2">
              <Label className="text-sm">Preço por unidade</Label>
              <Input
                value={singlePrice}
                onChange={(e) => {
                  setSinglePrice(e.target.value);
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
            <PriceTierInput
              initialTiers={cashPriceTiers ?? cashInitialTiers}
              onValidChange={(tiers) => {
                setCashPriceTiers(tiers);
              }}
            />
          ) : (
            /* Single Cash Price Input */
            <div className="space-y-2">
              <Label className="text-sm">Preço por unidade</Label>
              <Input
                value={cashPrice}
                onChange={(e) => {
                  setCashPrice(e.target.value);
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
