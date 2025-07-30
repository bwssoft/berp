"use client";

import type React from "react";
import { useState } from "react";
import { Upload, FileText, Edit3, Eye, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "../../../../component";
import { RadioGroup, RadioGroupItem } from "../../../../component/radio-group";

export function ActiveLoraForm() {
  const [serials, setSerials] = useState<string[]>([]);
  const [action, setAction] = useState<"activate" | "deactivate">("activate");
  const [manualInput, setManualInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (file: File, type: "xlsx" | "csv") => {
    setError("");

    try {
      if (type === "csv") {
        const text = await file.text();
        const lines = text.split("\n").filter((line) => line.trim());
        const extractedSerials = lines.flatMap((line) =>
          line
            .split(/[;,]/)
            .map((serial) => serial.trim())
            .filter(Boolean)
        );
        setSerials(extractedSerials);
      } else if (type === "xlsx") {
        // Simulação melhorada para Excel
        // Em produção, use: import * as XLSX from 'xlsx'
        const reader = new FileReader();
        reader.onload = (e) => {
          // Simular extração de seriais do Excel
          const mockSerials = ["00010002", "00010003", "00010004", "00010005"];
          setSerials(mockSerials);
        };
        reader.readAsArrayBuffer(file);
        // Para implementação real, descomente:
        /*
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        const extractedSerials = data.slice(1).map(row => row[0]).filter(Boolean)
        setSerials(extractedSerials)
        */
      }
    } catch (err) {
      setError(
        `Erro ao processar arquivo ${type.toUpperCase()}: ${err instanceof Error ? err.message : "Erro desconhecido"}`
      );
    }
  };

  const handleManualInput = (value: string) => {
    setManualInput(value);
    const extractedSerials = value
      .split(";")
      .map((serial) => serial.trim())
      .filter(Boolean);
    setSerials(extractedSerials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serials.length === 0) {
      setError("Por favor, forneça pelo menos um serial para processar.");
      return;
    }

    setIsProcessing(true);
    setError("");

    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
      `${action === "activate" ? "Ativando" : "Desativando"} seriais:`,
      serials
    );

    setIsProcessing(false);
    alert(
      `${serials.length} seriais foram ${action === "activate" ? "ativados" : "desativados"} com sucesso!`
    );
  };

  const clearSerials = () => {
    setSerials([]);
    setManualInput("");
    setError("");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Ativação ou Desativação de Seriais
        </CardTitle>
        <CardDescription className="text-gray-600 max-w-2xl mx-auto">
          Forneça uma lista de seriais para processar sua ativação ou
          desativação. Você pode enviar os dados através de arquivo Excel, CSV
          ou inserção manual.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Seleção de Ação */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Selecione a ação desejada:
          </Label>
          <RadioGroup
            value={action}
            onValueChange={(value) =>
              setAction(value as "activate" | "deactivate")
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="activate" id="activate" />
              <Label htmlFor="activate" className="cursor-pointer">
                Ativar Seriais
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deactivate" id="deactivate" />
              <Label htmlFor="deactivate" className="cursor-pointer">
                Desativar Seriais
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Métodos de Entrada */}
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="xlsx" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Excel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-serials">
                Digite os seriais separados por ponto e vírgula (;)
              </Label>
              <Textarea
                id="manual-serials"
                placeholder="00010002;00010003;00010004"
                value={manualInput}
                onChange={(e) => handleManualInput(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-sm text-gray-500">
                Exemplo: 00010002;00010003;00010004
              </p>
            </div>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload de arquivo CSV</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "csv");
                        }}
                        className="hidden"
                      />
                      <Label
                        htmlFor="csv-upload"
                        className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Selecionar arquivo CSV
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      ou arraste e solte o arquivo aqui
                    </p>
                  </div>
                </div>
              </div>

              {/* Exemplo de formato */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Formato esperado do arquivo CSV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700 font-medium">
                      Opção 1: Uma coluna com seriais
                    </p>
                    <div className="bg-white p-3 rounded border font-mono text-sm">
                      00010002
                      <br />
                      00010003
                      <br />
                      00010004
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700 font-medium">
                      Opção 2: Seriais separados por vírgula ou ponto e vírgula
                    </p>
                    <div className="bg-white p-3 rounded border font-mono text-sm">
                      00010002,00010003,00010004
                      <br />
                      ou
                      <br />
                      00010002;00010003;00010004
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="xlsx" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload de arquivo Excel</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <Input
                        id="xlsx-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "xlsx");
                        }}
                        className="hidden"
                      />
                      <Label
                        htmlFor="xlsx-upload"
                        className="cursor-pointer inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Selecionar arquivo Excel
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      ou arraste e solte o arquivo aqui
                    </p>
                    <p className="text-xs text-gray-400">
                      Formatos suportados: .xlsx, .xls
                    </p>
                  </div>
                </div>
              </div>

              {/* Exemplo de formato Excel */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Como organizar sua planilha Excel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-green-700 font-medium">
                      Estrutura recomendada:
                    </p>
                    <div className="bg-white rounded border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left border-r font-medium">
                              A
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                              B
                            </th>
                          </tr>
                        </thead>
                        <tbody className="font-mono">
                          <tr className="border-t">
                            <td className="px-3 py-2 border-r">Serial</td>
                            <td className="px-3 py-2 text-gray-500">
                              (opcional)
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-3 py-2 border-r">00010002</td>
                            <td className="px-3 py-2 text-gray-500">
                              Descrição
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-3 py-2 border-r">00010003</td>
                            <td className="px-3 py-2 text-gray-500">
                              Descrição
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-3 py-2 border-r">00010004</td>
                            <td className="px-3 py-2 text-gray-500">
                              Descrição
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">
                      <strong>Importante:</strong> Os seriais devem estar na
                      primeira coluna (coluna A). A primeira linha pode conter
                      cabeçalho e será ignorada automaticamente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Pré-visualização dos Seriais */}
        {serials.length > 0 && (
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <CardTitle className="text-lg">
                    Pré-visualização ({serials.length} seriais)
                  </CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={clearSerials}>
                  Limpar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {serials.map((serial, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {serial}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de Envio */}
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isProcessing || serials.length === 0}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              `${action === "activate" ? "Ativar" : "Desativar"} ${serials.length} Serial${serials.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
