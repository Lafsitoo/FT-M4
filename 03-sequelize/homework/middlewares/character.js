const { Router } = require("express");
const { Op, Character, Role } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { code, name, hp, mana } = req.body;

  if (!code || !name || !hp || !mana)
    return res.status(404).send("Falta enviar datos obligatorios");

  try {
    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (error) {
    res.status(404).send("Error en alguno de los datos provistos");
  }
});

router.get("/", async (req, res) => {
  const { race, age } = req.query;
  const condition = {};
  const where = {};
  if (race) where.race = race;
  if (age) where.age = age;
  // condition = {
  //     where: {
  //         race: "Human",
  //         age: 20
  //     }
  // }
  condition.where = where;
  const characters = await Character.findAll(condition);
  res.json(characters);
});

router.get("/young", async (req, res) => {
  const characters = await Character.findAll({
    where: {
      age: { [Op.lt]: 25 },
    },
  });
  res.json(characters);
});

router.get("/roles/:code", async (req, res) => {
  const { code } = req.params;
  const character = await Character.findByPk(code, {
    include: Role,
  });
  res.json(character);
});

router.get("/:code", async (req, res) => {
  const { code } = req.query;
  const character = await Character.findByPk(code);
  if (!character)
    return res
      .status(404)
      .send(`El código FIFTH no corresponde a un personaje existente`);
  res.json(character);
});

// codeCharacter: 'TWO',
// abilities: [
//   { name: 'abilityOne', mana_cost: 17.0 }, // ! Estas habilidades
//   { name: 'abilityTwo', mana_cost: 84.0 },
//   { name: 'abilityThree', mana_cost: 23.0 }
// ]

router.put("/addAbilities", async (req, res) => {
  const { codeCharacter, abilities } = req.body;
  const character = await Character.findByPk(codeCharacter); // ? Buscamos el personaje, una vez encontrado pregunto, tiene las sig habilidades?
  const promises = abilities.map((a) => character.createAbility(a)); // ? Si no las tienes, las recorre y las crea
  await Promise.all(promises); // ? No importa el orden de como lleguen, espera que lleguen las 3 y las incorporas al pj
  res.send("OK");
});

router.put("/:attribute", async (req, res) => {
  const { attribute } = req.params;
  const { value } = req.query;
  await Character.update(
    { [attribute]: value },
    {
      where: {
        [attribute]: null,
      },
    }
  );
  res.send("Personajes actualizados");
});

module.exports = router;
