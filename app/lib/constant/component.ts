import { Component } from "../@backend/domain";

const measure_unit: { [key in Component.Unit]: string } = {
  cm: "Centímetro (cm)",
  m: "Metro (m)",
  g: "Grama (g)",
  kg: "Quilo (kg)",
  ml: "Mililitro (ml)",
  l: "Litro (L)",
  un: "Unidade (un)",
};

export const componentConstants = {
  measure_unit,
};
