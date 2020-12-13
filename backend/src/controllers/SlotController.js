const knex = require("../database/knex");

module.exports = {
  async index(req, res, next) {
    try {

      const connectDB = await knex.connect();
      const allSlots = await connectDB("slots");

      return res.json(allSlots);

    } catch (error) {
        next(error);
    }
  },

  async view(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Missing Slot ID" });
      }

      const connectDB = await knex.connect();
      const slotFromDB = await connectDB("slots").where({ id: id }).first();

      if (!slotFromDB) return res.status(400).json({ message: "No Slot Found" });

      return res.status(200).json({ slot : slotFromDB });

    } catch (error) {
        next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { hairdresser_id, startTime, duration, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;

      if (!hairdresser_id || !startTime || !duration) {
        return res.status(400).json({ message: "Missing Required Information from Request" });
      }

     const connectDB = await knex.connect();
      const newSlot = await connectDB('slots').insert({
        hairdresser_id: hairdresser_id,
        start_time: startTime,
        duration: duration,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
      });

      return res.status(201).json({ message: "Slot Created Successfully" });

    } catch (error) {
        next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id, startTime, duration, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;

      if (!id || !startTime || !duration) {
        return res.status(400).json({ message: "Missing Required Information from Request" });
      }

      const connectDB = await knex.connect();
      const slotFromDB = await connectDB("slots").where({ id: id }).first();

      if(!slotFromDB) return res.status(400).json({ message: "No Slot Found" });

      const updatedSlot = await connectDB('slots').where({ id: id }).update({
        start_time: startTime,
        duration: duration,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
      });

      return res.status(200).json({ message: 'Slot updated successfully'});

    } catch (error) {
        next(error);
    }
  },

  async delete(req, res, next) {
    try {

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Missing Required Information from Request" });
      }

      const connectDB = await knex.connect();
      const slotFromDB = await connectDB("slots").where({ id: id }).first();

      if(!slotFromDB) return res.status(400).json({ message: "No Slot Found" });

      const deletedSlot = await connectDB('slots').where({ id: id}).del();

      return res.status(200).json({ message: 'Slot deleted successfully' });

    } catch (error) {
        next(error);
    }
  },
};