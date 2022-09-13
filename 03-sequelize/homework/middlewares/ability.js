const { Router } = require("express");
const { Ability } = require("../db");
const Character = require("../db/models/Character");
const router = Router();

router.post("/", async (req, res) => {
  const { name, mana_cost } = req.body;
  if (!name || !mana_cost)
    return res.status(404).send("Falta enviar datos obligatorios");
  try {
    const ability = await Ability.create(req.body);
    res.status(201).json(ability);
  } catch (error) {
    res.status(404).send("Error en los datos");
  }
});

/* Setting the character to the ability. */
router.put("/setCharacter", async (req, res) => {
  const { idAbility, codeCharacter } = req.body;
  // const character = await Character.findByPk(codeCharacter);
  const ability = await Ability.findByPk(idAbility); // ? Busco al pj y espero a la habilidad
  // await character.addAbility(idAbility);
  await ability.setCharacter(codeCharacter); // ? Hasta no encontrar la habilidad, no puedo asiociarla
  res.json(ability); // ? La devuelvo
});

module.exports = router;
