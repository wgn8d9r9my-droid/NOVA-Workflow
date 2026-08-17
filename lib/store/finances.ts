import { createEntityStore } from "./create-entity-store";
import type { Transaction, Client } from "@/types/entities";

export const useTransactionsStore = createEntityStore<Transaction>("nova.transactions", "transactions");
export const useClientsStore = createEntityStore<Client>("nova.clients", "clients");
