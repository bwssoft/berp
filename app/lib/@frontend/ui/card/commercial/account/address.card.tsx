"use client";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { Copy, RotateCcw, Edit, Trash } from "lucide-react";
import { Button } from '@/frontend/ui/component/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/ui/component/card';

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Badge } from "@bwsoft/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../component/tooltip";
import { Separator } from "../../../component/separator";
import {IAddress} from "@/app/lib/@backend/domain/commercial/entity/address.definition";

interface AddressCardProps {
  title?: string;
  address: IAddress;
  onRefresh?: () => void;
  onCopy?: () => void;
  onEdit?: (address: IAddress) => void;
  onDelete?: (addressId: string) => void;
}

export function AddressCard({
  title = "Endereço",
  address,
  onRefresh,
  onCopy,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
      return;
    }

    try {
      const {
        street,
        number,
        district,
        city,
        state,
        zip_code,
        complement,
        reference_point,
      } = address;

      let text = `${street}, ${number}, ${district}\n${city} - ${state}, ${zip_code}`;

      if (complement) {
        text += `\nComplemento: ${complement}`;
      }

      if (reference_point) {
        text += `\nPonto de Referência: ${reference_point}`;
      }

      await navigator.clipboard.writeText(text);

      toast({
        title: "Sucesso!",
        description: "Endereço copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o endereço.",
        variant: "error",
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(address);
    }
  };

  const handleDelete = () => {
    if (onDelete && address.id) {
      onDelete(address.id);
    }
  };

  const formatAddress = () => {
    const parts = [];

    if (address.street && address.number && address.district) {
      parts.push(`${address.street}, ${address.number}, ${address.district}`);
    }

    if (address.city && address.state && address.zip_code) {
      parts.push(`${address.city} - ${address.state}, ${address.zip_code}`);
    }

    return parts;
  };

  const addressParts = formatAddress();

  return (
    <TooltipProvider>
      <Card className="w-full max-w-sm transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-base font-semibold leading-none">
                {title}
              </CardTitle>

              {address.type && address.type.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {address.type.map((type, index) => (
                    <Badge
                      label={type}
                      key={index}
                      variant="rounded"
                      className="text-xs font-medium"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-1">
              {address.default_address && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={onRefresh}
                      aria-label="Atualizar endereço"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Atualizar</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                    aria-label="Copiar endereço"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Copiar endereço</p>
                </TooltipContent>
              </Tooltip>

              {!address.default_address && onEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={handleEdit}
                      aria-label="Editar endereço"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Editar endereço</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {!address.default_address && onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={handleDelete}
                      aria-label="Excluir Endereço"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Excluir Endereço</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            {addressParts.map((part, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? "font-medium text-sm"
                    : "text-sm text-muted-foreground"
                }
              >
                {part}
              </div>
            ))}

            {(address.complement || address.reference_point) && (
              <>
                <Separator className="my-3" />
                <div className="space-y-1">
                  {address.complement && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Complemento:
                      </span>{" "}
                      {address.complement}
                    </div>
                  )}
                  {address.reference_point && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Ponto de Referência:
                      </span>{" "}
                      {address.reference_point}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
