import { Controller, useFormContext } from "react-hook-form";
import { Alert, Input, Select, Toggle } from "../../../../component";
import { configurationProfileConstants } from "@/app/lib/constant";
import { ConfigurationProfileSchema } from "../create/use-configuration-profile.create.form";

const configConstants = configurationProfileConstants.config.DM_E3_PLUS;
const { timezones } = configurationProfileConstants;

export function SpecificE3PlusConfigurationProfileForm() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<ConfigurationProfileSchema>();
  return (
    <div className="space-y-8 mt-6">
      {/* Cabeçalho */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">
          Configuração Específicas do E3+
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure parametros específicos do E3+
        </p>
      </div>

      {/* Seção 1: Configurações Básicas do Dispositivo */}
      <section className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-6">
          Configurações Básicas
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Senha do Dispositivo */}
          <div className="sm:col-span-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Alteração de Senha
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("config.specific.password.old")}
                id="old_password"
                label="Senha Atual"
                placeholder="000000"
                error={errors?.config?.specific?.password?.old?.message}
              />
              <Input
                {...register("config.specific.password.new")}
                id="new_password"
                label="Nova Senha"
                placeholder="123456"
                error={errors?.config?.specific?.password?.new?.message}
              />
            </div>
          </div>

          {/* Configurações de Bloqueio */}
          <div className="sm:col-span-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Configurações de Bloqueio
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="config.specific.lock_type"
                render={({ field }) => (
                  <Select
                    name="lock_type"
                    data={configConstants.lockType}
                    keyExtractor={(d) => d.value}
                    valueExtractor={(d) => d.label}
                    labelExtractor={(d) => d.label}
                    label="Tipo de Bloqueio"
                    value={configConstants.lockType.find(
                      (d) => d.value === field.value
                    )}
                    onChange={(d) => field.onChange(d.value)}
                  />
                )}
              />
            </div>
          </div>

          {/* Configurações Gerais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:col-span-2">
            <Controller
              control={control}
              name="config.specific.timezone"
              render={({ field }) => (
                <Select
                  name="timezone"
                  data={timezones}
                  keyExtractor={(d) => d.value}
                  valueExtractor={(d) => d.label}
                  labelExtractor={(d) => d.label}
                  label="Fuso Horário"
                  value={timezones.find((tz) => tz.value === field.value)}
                  onChange={(d) => field.onChange(d.value)}
                />
              )}
            />

            <Controller
              control={control}
              name="config.specific.work_mode"
              render={({ field }) => (
                <Select
                  name="config.specific.work_mode"
                  data={configConstants.workMode}
                  keyExtractor={(d) => d.value}
                  valueExtractor={(d) => d.label}
                  labelExtractor={(d) => d.label}
                  label="Modo de trabalho"
                  value={configConstants.workMode.find(
                    (d) => d.value === field.value
                  )}
                  onChange={(d) => field.onChange(d.value)}
                />
              )}
            />

            <Controller
              control={control}
              name="config.specific.accelerometer_sensitivity"
              render={({ field }) => (
                <Select
                  name="config.specific.accelerometer_sensitivity"
                  data={configConstants.accelerometerSensitivity}
                  keyExtractor={(d) => d.value}
                  valueExtractor={(d) => d.label}
                  labelExtractor={(d) => d.label}
                  label="Sensibilidade do acelerômetro"
                  value={configConstants.accelerometerSensitivity.find(
                    (d) => d.value === field.value
                  )}
                  onChange={(d) => field.onChange(d.value)}
                />
              )}
            />

            <Controller
              control={control}
              name="config.specific.economy_mode"
              render={({ field }) => (
                <Select
                  name="economy_mode"
                  data={configConstants.economyMode}
                  keyExtractor={(d) => d.value}
                  valueExtractor={(d) => d.label}
                  labelExtractor={(d) => d.label}
                  label="Modo de Economia"
                  value={configConstants.economyMode.find(
                    (d) => d.value === field.value
                  )}
                  onChange={(d) => field.onChange(d.value)}
                />
              )}
            />

            <Input
              {...register("config.specific.odometer")}
              id="odometer"
              label="Hodômetro"
              placeholder="5000"
              type="number"
              error={errors.config?.specific?.odometer?.message}
            />

            <Input
              {...register("config.specific.max_speed")}
              id="max_speed"
              label="Velocidade Máxima"
              placeholder="150"
              type="number"
              error={errors.config?.specific?.max_speed?.message}
            />

            <Input
              {...register("config.specific.sensitivity_adjustment")}
              id="sensibility"
              label="Ajuste de Sensibilidade"
              placeholder="500"
              type="number"
              error={errors.config?.specific?.sensitivity_adjustment?.message}
            />

            <Input
              {...register("config.specific.sleep")}
              id="sleep"
              label="Sleep"
              placeholder="2"
              type="number"
              error={errors.config?.specific?.sleep?.message}
            />
          </div>
        </div>
      </section>

      {/* Seção 3: Funções Principais */}
      <section className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <h3 className="font-medium text-gray-900">Funções Principais</h3>
          <p className="mt-1 text-sm text-gray-600">
            Configurações que geram comandos imediatamente ao serem alteradas
          </p>
        </div>
        <Alert
          title="Atenção: Estas alterações gerarão comandos imediatamente"
          variant="attention"
          className="mb-6"
        />

        <div className="space-y-4">
          {/* Funções padrão */}
          <div className="grid grid-cols-1 gap-4">
            {configConstants.functions.map((func, id) => (
              <div
                key={id}
                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <label
                    htmlFor={`functions-${func.name}`}
                    className="font-medium text-gray-600"
                  >
                    {func.label}
                  </label>
                </div>
                <Controller
                  control={control}
                  name={func.name as any}
                  render={({ field }) => (
                    <Toggle onChange={field.onChange} value={field.value} />
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 4: Funções Opcionais */}
      <section className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <h3 className="font-medium text-gray-900">Funções Opcionais</h3>
          <p className="mt-1 text-sm text-gray-600">
            Configurações que só geram comandos quando explicitamente ativadas
          </p>
        </div>
        <Alert
          title="Atenção: Estas funções só gerarão comandos quando ativadas"
          variant="attention"
          className="mb-6"
        />

        <div className="space-y-4">
          {configConstants.optionalFunctions.map((func, id) => (
            <div
              key={id}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <label
                  htmlFor={`optional-${func.name}`}
                  className="font-medium text-gray-600"
                >
                  {func.label}
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    id={`optional-checkbox-${func.name}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`optional-checkbox-${func.name}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    Ativar comando
                  </label>
                </div>
                <Controller
                  control={control}
                  name={
                    func.name as keyof ConfigurationProfileSchema["config"]["specific"]
                  }
                  render={({ field }) => (
                    <Toggle onChange={field.onChange} value={field.value} />
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
