import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { updateOneProductById } from '@/app/lib/@backend/action';
import { IInput, IProduct } from '@/app/lib/@backend/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { productConstants } from '@/app/lib/constant/product';

const schema = z.object({
  name: z.string().min(1, 'Esse campo não pode ser vazio'),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  color: z.string(),
  files: z.any(),
  inputs: z.array(z.object({ input_id: z.string(), quantity: z.coerce.number() })),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IProduct
  inputs: IInput[]
}

const statsMapped = productConstants.statsMapped

export function useProductUpdateForm(props: Props) {
  const { defaultValues, inputs } = props
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
    watch
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputs",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await updateOneProductById({ id: defaultValues.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o produto!",
        variant: "error",
      });
    }
  });

  const handleAppendInput = append
  const handleRemoveInput = remove

  //iteração para agregar os dados dos insumos dobanco de dados com os dados do formulário
  const inputsMerged = (watch("inputs") ?? [])
    .filter((el) => {
      return inputs.find((e) => e.id === el.input_id) !== undefined;
    })
    .map((i) => {
      const input = inputs.find((e) => e.id === i.input_id);
      return {
        input: input!,
        color: input!.color,
        name: input!.name,
        price: input?.price ?? 0,
        total: i.quantity * (input?.price ?? 0),
        quantity: i.quantity,
      };
    });

  //objeto com os valores de insumos em maior e menor quantidade, preço, etc...
  const stats = Object.entries(
    inputsMerged.reduce(
      (acc, item) => {
        if (item.quantity > acc.maxQuantity.quantity) {
          acc.maxQuantity = item;
        }
        if (item.quantity < acc.minQuantity.quantity) {
          acc.minQuantity = item;
        }
        if (item.price > acc.maxPrice.price) {
          acc.maxPrice = item;
        }
        if (item.price < acc.minPrice.price) {
          acc.minPrice = item;
        }
        if (item.total > acc.maxTotal.total) {
          acc.maxTotal = item;
        }
        if (item.total < acc.minTotal.total) {
          acc.minTotal = item;
        }
        return acc;
      },
      {
        maxQuantity: inputsMerged[0],
        minQuantity: inputsMerged[0],
        maxPrice: inputsMerged[0],
        minPrice: inputsMerged[0],
        maxTotal: inputsMerged[0],
        minTotal: inputsMerged[0],
      }
    )
  )
    .filter(([_, entrie]) => entrie)
    .map(([key, entire]) => ({
      name: `${statsMapped[key as keyof typeof statsMapped](entire)}`,
      value: entire.name,
    }));

  const totalCost = inputsMerged.reduce((acc, cur) => acc + cur.total, 0)
  const averageCost = totalCost / inputs.length

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    inputsOnForm: fields,
    handleAppendInput,
    handleRemoveInput,
    insights: {
      totalCost,
      stats,
      merged: inputsMerged,
      averageCost
    }
  };
}
