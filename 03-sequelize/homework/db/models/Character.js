const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Character",
    {
      code: {
        type: DataTypes.STRING(5),
        allowNull: false,
        primaryKey: true,
        validate: {
          codeValidator(valor) {
            // henry HEnrY HENRY
            if (valor.toLowerCase() === "henry") {
              throw new Error("Value cannot be henry");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notIn: [["Henry", "SoyHenry", "Soy Henry"]],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        get() {
          const edad = this.getDataValue("age");
          return edad ? `${edad} years old` : edad;
        },
      },
      race: {
        type: DataTypes.ENUM(
          "Human",
          "Elf",
          "Machine",
          "Demon",
          "Animal",
          "Other"
        ),
        defaultValue: "Other",
      },
      hp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      mana: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date_added: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },

    {
      timestamps: false,
    }
  );
};
