"use server"

import { IProduct } from "../../definition"
import productRepository from "../../repository/mongodb/product/product.repository"


const repository = productRepository

export async function createOneProduct(input: Omit<IProduct, "id" | "created_at">) {
  await repository.create({ ...input, created_at: new Date(), id: crypto.randomUUID() })
  return input
}

export async function findOneProduct(input: Partial<IProduct>) {
  return await repository.findOne(input)
}

export async function updateOneProductById(query: { id: string }, value: Omit<IProduct, "id" | "created_at">) {
  return await repository.updateOne(query, value)
}

export async function deleteOneProductById(query: { id: string }) {
  return await repository.deleteOne(query)
}

export async function findAllProduct(): Promise<IProduct[]> {
  return await repository.findAll() as IProduct[]
}

