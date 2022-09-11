const { Router } = require("express");

const { Op, Character, Role, Ability } = require("../db");
const { validatePost } = require("./util");
const router = Router();

// /character implicito
// router.get("/algo")

// localhost:xxxx/character/algo
router.post("/", async (req, res) => {
  // validación
  const error = validatePost(req.body.personaje);
  if (error) return res.status(404).send("Falta enviar datos obligatorios");

  //   Character.create({ ...req.body })
  //     .then((pj) => res.status(201).json(pj))
  //     .catch((err) =>
  //       res.status(404).send("Error en alguno de los datos provistos")
  //     );

  const { habilidades } = req.body;

  try {
    const pj = await Character.create({ ...req.body.personaje });

    // console.log(pj.__proto__);

    if (pj) {
      const resultado = await pj.addAbilities(habilidades);
      return res.send(
        await Character.findByPk(pj.code, {
          include: Ability,
        })
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send("Error en alguno de los datos provistos");
  }
});

router.get("/", async (req, res) => {
  const { race, age } = req.query;
  // req.query --> {race: "algo", "name"=true, age:true}
  //   const arreglo = Object.keys(req.query)
  // ["race", "name", "age"]

  try {
    if (!race) {
      return res.status(200).json(await Character.findAll());
    } else {
      const filtro = await Character.findAll({
        where: { race, age },
        // where: {
        //   [Op.and]: [{race}, {age}]
        // }
        // attributes: arreglo,
      });
      if (filtro.length > 0) return res.status(200).json(filtro);
    }
  } catch (error) {
    return res.status(400).json({ err: error });
  }
});

router.get("/young", async (req, res) => {
  try {
    const personajes = await Character.findAll({
      where: {
        age: {
          // [Op.lt] --->  < 25
          [Op.lt]: 25,
        },
      },
    });

    res.json(personajes);
  } catch (error) {
    return res.send(error);
  }
});

router.get("/:code", (req, res) => {
  const { code } = req.params;

  if (!code)
    return res.status(400).json({ err: "Falta enviar code por params" });
  else {
    Character.findByPk(code)
      .then((pj) => res.status(200).json(pj))
      .catch((err) => res.status(400).json({ err }));
  }
});

router.put("/:attribute", (req, res) => {
  const { attribute } = req.params; // age
  const { value } = req.query; // 40

  if (!attribute || !value)
    return res.status(400).json({ err: "Missing params or query" });

  Character.update(
    { [attribute]: value },
    {
      where: {
        [attribute]: null,
      },
    }
  )
    .then((pepe) => res.json({ msg: "Personajes actualizados", data: pepe }))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// const {personaje} = req.body
// ... await User.update({...personaje})

module.exports = router;
