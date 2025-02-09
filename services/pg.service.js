const AppointmentDetails = require("../models/appointmentDetails.model");
const PatientDetails = require("../models/patientDetails.model");
const UserDetails = require("../models/userDetails.model");
const { error } = require("./response.service");

const models = {
  AppointmentDetails,
  PatientDetails,
  UserDetails,
};

/**
 * Database service for CRUD operations
 */
const databaseService = {
  
  async count({ model, query = {} }) {
    try {
      const selectedModel = models[model];
      if (!selectedModel) throw new Error(`Invalid model: ${model}`);
      const countResult = await selectedModel.count({ where: query });
      return countResult;
    } catch (e) {
      error(`::DATABASE ERROR:: (count) method: ${e}`);
      throw e;
    }
  },

  findOne: async ({ model, query = {}, include = {} }) => {
    try {
      const selectedModel = models[model];
      if (!selectedModel) throw new Error(`Invalid model: ${model}`);

      // If 'include' is specified, handle related model
      if (include?.model) {
        const relatedModel = models[include.model];
        if (!relatedModel) throw new Error(`Invalid include model: ${include.model}`);

        // Fetch related data
        const relatedData = await databaseService.findOne({
          model: include.model,
          query: {
            where: include?.where || query?.where,
            attributes: include?.attributes || [],
          },
        });
        // Fetch main model data
        const result = await selectedModel.findOne(query);

        return result
          ? {
              ...result.get({ plain: true }),
              [include.model]: relatedData,
            }
          : null;
      }

      // Fetch main model data only
      const result = await selectedModel.findOne(query);
      return result ? result.get({ plain: true }) : null;
    } catch (e) {
      console.error(`::DATABASE ERROR:: (findOne) method: ${e.message}`);
      throw e;
    }
  },
  

  async create({ model, data }) {
    try {
      const selectedModel = models[model];
      if (!selectedModel) throw new Error(`Invalid model: ${model}`);
      const createdData = await selectedModel.create(data);
      return createdData ? createdData.get({ plain: true }) : null;
    } catch (e) {
      error(`::DATABASE ERROR:: (create) method: ${e}`);
      throw e;
    }
  },

  async update({ model, data, where = {} }) {
    try {
      const selectedModel = models[model];
      if (!selectedModel) throw new Error(`Invalid model: ${model}`);
      const updateResult = await selectedModel.update(data, { where, individualHooks: true });
      return updateResult;
    } catch (e) {
      error(`::DATABASE ERROR:: (update) method: ${e}`);
      throw e;
    }
  },

  async findAll({ model, query = {} }) {
    try {
      if (!query.attributes || query.attributes.length === 0) {
        throw new Error("Attributes are required in (findAll) method");
      }
      const selectedModel = models[model];
      if (!selectedModel) throw new Error(`Invalid model: ${model}`);
      const data = await selectedModel.findAll(query);
      return data ? data.map((result) => result.get({ plain: true })) : null;
    } catch (e) {
      error(`::DATABASE ERROR:: (findAll) method: ${e}`);
      throw e;
    }
  },

  async destroy({ model, where = {} }) {
    try {
      const selectedModel = models[model];
      if (!selectedModel) throw new Error(`Invalid model: ${model}`);
      const result = await selectedModel.destroy({ where });
      return result;
    } catch (e) {
      error(`::DATABASE ERROR:: (destroy) method: ${e}`);
      throw e;
    }
  },

  async bulkUpdate(updates) {
    try {
      const checkAry = (!Array.isArray(updates) || updates.length === 0);
      if (checkAry) throw new Error('Invalid updates array');

      await Promise.all(
        updates.map(async ({ model, data, where }) => {
          const selectedModel = models[model];
          if (!selectedModel) throw new Error(`Invalid model: ${model}`);

          await selectedModel.update(data, {
            where,
            individualHooks: true,
          });
        })
      );
      return true;
    } catch (e) {
      error(`::DATABASE ERROR:: (bulkUpdate): ${e.message}`);
      throw e;
    }
  },
};

module.exports = databaseService;
