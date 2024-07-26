import { createManySchedule, findManyDeviceBySerial } from '@/app/lib/@backend/action';
import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { findByRegex, handleXlsxFile } from '@/app/lib/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  variablesToBeInserted: z.record(z.string(), z.string()).transform((vars) => {
    return Object.fromEntries(
      Object.entries(vars).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
  }).optional(),
  devices: z.array(z.object({ serial: z.string() })),
  firmware: z.object({ id: z.string(), name: z.string() }).optional(),
  commandSetup: z.object({
    isMultiple: z.boolean(),
    withSerial: z.boolean(),
    withFirmware: z.boolean()
  }),
  automaticFillVariables: z.object({
    firmware: z.string().optional(),
    serial: z.string().optional(),
  }),
  command: z.object({ id: z.string(), data: z.string() })
});

export type Schema = z.infer<typeof schema>;

export function useScheduleCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
    reset: hookFormReset,
    setError
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      commandSetup: {
        isMultiple: true,
        withSerial: false,
        withFirmware: false
      },
      automaticFillVariables: {
        firmware: undefined,
        serial: undefined,
      },
      variablesToBeInserted: {}
    }
  });
  const formValues = watch()


  const { fields, append, remove } = useFieldArray({
    control,
    name: "devices",
  });
  const handleAppendDevice = append
  const handleRemoveDevice = remove
  const handleFile = async (fileList: File[] | null) => {
    const devices = await handleXlsxFile<{
      serial?: string,
    }>(fileList, handleFormatDeviceFromFile)
    devices?.forEach(device => handleAppendDevice({
      serial: device.serial ?? "",
    }))
  }
  const handleFormatDeviceFromFile = (obj: {
    Serial: string,
  }) => {
    return {
      serial: obj.Serial ?? undefined,
    }
  }




  const watchedVariablesToBeInserted = formValues?.variablesToBeInserted
  const commandData = formValues?.command?.data ?? ""
  const availableVariables = findByRegex(commandData, /{{.+?}}/g)
    .reduce((acc, cur) => {
      const key = `var_${cur}`
      const value = watchedVariablesToBeInserted?.[key] ?? ""
      return { ...acc, [key]: value }
    }, {})
  const variablesToBeInserted = findByRegex(commandData, /{{.+?}}/g)
    .filter(v => {
      return `var_${v}` !== formValues.automaticFillVariables?.firmware && `var_${v}` !== formValues.automaticFillVariables?.serial
    })
    .reduce((acc, cur) => {
      const key = `var_${cur}`
      const value = watchedVariablesToBeInserted?.[key] ?? ""
      return { ...acc, [key]: value }
    }, {})




  const replaceVariables = (str: string, vars: Record<string, string>) => {
    return str.replace(/{{(.*?)}}/g, (match, p1) => {
      const key = `var_${p1}`;
      return vars[key] || match;
    });
  };
  const createCommandPreview = (
    serial: string,
    formValues: any,
    variablesInserted: any
  ) => {
    const automatic: any = {}
    const firmware = formValues?.firmware?.name
    const automaticSerial = formValues.automaticFillVariables.serial
    const automaticFirmware = formValues.automaticFillVariables.firmware
    if (automaticSerial) (automatic[automaticSerial] = serial)
    if (automaticFirmware) (automatic[automaticFirmware] = firmware)
    const variables = Object.assign(
      {},
      formValues?.command?.variables,
      variablesInserted,
      automatic
    )
    const commandPreview = replaceVariables(
      commandData,
      variables
    )
    return commandPreview
  }
  const preview = fields.map(({ serial }) => createCommandPreview(serial, formValues, watchedVariablesToBeInserted))




  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const devicesInForm = data.devices
      const firmwareInForm = data?.firmware?.id
      const devicesInDb = await findManyDeviceBySerial(devicesInForm.map(({ serial }) => serial))

      if (!devicesInForm.every(({ serial }) => devicesInDb.find(d => d.serial === serial))) {
        setError("devices", {
          message: "Alguns dispositivos não estão cadastrados no banco de dados"
        })
        return
      }

      const schedules = devicesInDb.map(d => ({
        device_id: d.id,
        command_id: data.command.id,
        data: createCommandPreview(d.serial, data, data.variablesToBeInserted),
        pending: false,
        firmware_id: firmwareInForm,
      }))

      await createManySchedule(schedules);

      toast({
        title: "Sucesso!",
        description: "Agendamento registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      console.log(e)
      toast({
        title: "Erro!",
        description: "Falha ao registrar o agendamento!",
        variant: "error",
      });
    }
  });

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    getValues,
    reset: hookFormReset,

    availableVariables: Object.entries(availableVariables ?? {}),
    variablesToBeInserted: Object.entries(variablesToBeInserted ?? {}),

    commandSetup: formValues.commandSetup,
    automaticFillVariables: formValues.automaticFillVariables,


    devicesOnForm: fields,
    handleAppendDevice,
    handleRemoveDevice,
    handleFile,

    preview
  };
}
