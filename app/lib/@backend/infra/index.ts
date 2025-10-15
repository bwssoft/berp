export { bmessageGateway } from "./gateway/bmessage/bmessage.gateway";
export { cnpjaGateway } from "./gateway/cnpja/cnpja.gateway";
export { firebaseGateway } from "./gateway/firebase/firebase.gateway";
export { nominatimGateway } from "./gateway/nominatim/nominatim.gateway";
export { priceTableSchedulerGateway } from "./gateway/price-table-scheduler/price-table-scheduler.gateway";
export { attachmentOmieGateway } from "./gateway/omie/attachments.omie.gateway";
export { proposalOmieGateway } from "./gateway/omie/proposal.omie.gateway";
export { saleOrderOmieGateway } from "./gateway/omie/sale-order.omie.gateway";
export { viaCepGateway } from "./gateway/viacep/viacep.gateway";

export { autoTestLogRepository } from "./repository/mongodb/production/auto-test-log.repository";
export { configurationLogRepository } from "./repository/mongodb/production/configuration-log.repository";
export { firmwareUpdateLogRepository } from "./repository/mongodb/production/firmware-update-log.repository";
export { identificationLogRepository } from "./repository/mongodb/production/identification-log.repository";
export { productionOrderRepository } from "./repository/mongodb/production/production-order.repository";
export { productionProcessRepository } from "./repository/mongodb/production/production-process.repository";

export { baseRepository } from "./repository/mongodb/logistic/base.repository";
export { itemRepository } from "./repository/mongodb/logistic/item.repository";
export { movementRepository } from "./repository/mongodb/logistic/movement.repository";
export { stockRepository } from "./repository/mongodb/logistic/stock.repository";

export { financialOrderRepository } from "./repository/mongodb/financial/financial-order.repository";

export { accountAttachmentRepository } from "./repository/mongodb/commercial/account-attachment.repository";
export { accountEconomicGroupRepository } from "./repository/mongodb/commercial/account.economic-group.repository";
export { accountRepository } from "./repository/mongodb/commercial/account.repository";
export { addressRepository } from "./repository/mongodb/commercial/address.repository";
export { clientRepository } from "./repository/mongodb/commercial/client.repository";
export { contactRepository } from "./repository/mongodb/commercial/contact.repository";
export { historicalRepository } from "./repository/mongodb/commercial/historical.repository";
export { negotiationTypeRepository } from "./repository/mongodb/commercial/negotiation-type.repository";
export { priceTableRepository } from "./repository/mongodb/commercial/price-table.repository";
export { priceTableServiceRepository } from "./repository/mongodb/commercial/price-table-service.repository";
export { productCategoryRepository } from "./repository/mongodb/commercial/product.category.repository";
export { productRepository } from "./repository/mongodb/commercial/product.repository";
export { proposalRepository } from "./repository/mongodb/commercial/proposal.repository";
export { ruleRepository } from "./repository/mongodb/commercial/rule.repository";
export { sectorRepository } from "./repository/mongodb/commercial/sector.repository";

export { enterpriseRepository } from "./repository/mongodb/business/enteprise.repository";

export { auditRepository } from "./repository/mongodb/admin/audit.repository";
export { controlRepository } from "./repository/mongodb/admin/control.repository";
export { profileRepository } from "./repository/mongodb/admin/profile.repository";
export { userRepository } from "./repository/mongodb/admin/user.repository";

export { commandRepository } from "./repository/mongodb/engineer/command.repository";
export { scheduleRepository } from "./repository/mongodb/engineer/command-schedule.repository";
export { componentCategoryRepository } from "./repository/mongodb/engineer/component.category.repository";
export { componentRepository } from "./repository/mongodb/engineer/component.repository";
export { configurationProfileRepository } from "./repository/mongodb/engineer/configuration-profile.repository";
export { deviceRepository } from "./repository/mongodb/engineer/device.repository";
export { firmwareRepository } from "./repository/mongodb/engineer/firmware.repository";
export { inputCategoryRepository } from "./repository/mongodb/engineer/input.category.repository";
export { inputRepository } from "./repository/mongodb/engineer/input.repository";
export { requestToUpdateRepository } from "./repository/mongodb/engineer/request-to-update-firmware.repository";
export { serialRepository } from "./repository/mongodb/engineer/serial.repository";
export { technicalSheetRepository } from "./repository/mongodb/engineer/technical-sheet.repository";
export { technologyRepository } from "./repository/mongodb/engineer/technology.repository";

export { accountAttachmentHistoricalObjectRepository } from "./repository/s3/commercial/account-attachment-historical.repository";
export { accountAttachmentObjectRepository } from "./repository/s3/commercial/account-attachment.repository";
export { proposalObjectRepository } from "./repository/s3/commercial/proposal.repository";
export { userObjectRepository } from "./repository/s3/admin/user.s3.repository";
