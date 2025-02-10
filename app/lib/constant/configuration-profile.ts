import { IConfigurationProfile } from "@/app/lib/@backend/domain"

const type: { [key in IConfigurationProfile["type"]]: string } = {
    BOAT: "Barco",
    CAR: "Carro",
    BUS: "Ônibus",
    MOTORCYCLE: "Moto",
    TRUCK: "Caminhão",
    UTILITY_VEHICLE: "Veículo Utilitário",
    BIKE: "Bicicleta",
    ANIMAL: "Animal",
    ROAD_IMPLEMENT: "Implemento Rodoviário",
    FARM_IMPLEMENT: "Implemento Agrícola",
    JET: "Jato",
    JET_SKI: "Jet Ski",
    AIRCRAFT: "Aeronave",
    STUFF: "Carga",
    HUMAN: "Humano",
    OTHER: "Outro"
};

const useCase: { [key in IConfigurationProfile["use_case"]]: string } = {
    CLIENT: "Cliente",
    INTERNAL: "Interno",
};


export const configurationProfileConstants = {
    type,
    useCase
}